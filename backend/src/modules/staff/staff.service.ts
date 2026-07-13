import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { DatabaseService } from "../../database/database.service";
import type {
  DeleteStaffResponse,
  SaveStaffBody,
  StaffKpi,
  StaffListResponse,
  StaffMember,
  StaffStatus
} from "./staff.dto";

type BusinessRow = {
  id: string;
};

type StaffRow = {
  id: string;
  user_id: string | null;
  name: string;
  username: string;
  can_login: boolean;
  email: string;
  phone: string;
  role: string;
  shift: string;
  shift_time: string;
  status: StaffStatus;
  avatar_url: string | null;
  gender: string;
  birthday: string;
  address: string;
  identity_number: string;
  join_date: string;
  note: string | null;
  revenue: string;
  orders_count: string;
  rating: string;
  created_at: Date;
  updated_at: Date;
};

const staffStatusSet = new Set<StaffStatus>(["active", "inactive", "on-leave"]);
const fallbackAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80";

@Injectable()
export class StaffService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureStaffSchema();
  }

  async listBusinessStaff(
    businessSlug: string,
    query: { q?: string; role?: string; status?: string }
  ): Promise<StaffListResponse> {
    const business = await this.getBusinessBySlug(businessSlug);

    const search = query.q?.trim() ? `%${query.q.trim()}%` : null;
    const role = query.role?.trim() && query.role !== "all" ? query.role.trim() : null;
    const status = isStaffStatus(query.status) ? query.status : null;
    const rows = await this.database.sql<StaffRow[]>`
      SELECT ${this.staffSelectFields()}
      FROM staff_members sm
      WHERE sm.business_id = ${business.id}
        AND sm.deleted_at IS NULL
        AND (${search}::text IS NULL OR sm.name ILIKE ${search} OR sm.email ILIKE ${search} OR sm.phone ILIKE ${search})
        AND (${role}::text IS NULL OR sm.role = ${role})
        AND (${status}::text IS NULL OR sm.status = ${status})
      ORDER BY
        CASE sm.status
          WHEN 'active' THEN 1
          WHEN 'on-leave' THEN 2
          ELSE 3
        END,
        sm.created_at ASC
    `;
    const allRows = await this.database.sql<StaffRow[]>`
      SELECT ${this.staffSelectFields()}
      FROM staff_members sm
      WHERE sm.business_id = ${business.id}
        AND sm.deleted_at IS NULL
    `;
    const allStaff = allRows.map(toStaffMember);

    return {
      staff: rows.map(toStaffMember),
      kpis: buildStaffKpis(allStaff)
    };
  }

  async getBusinessStaff(businessSlug: string, staffId: string): Promise<StaffMember> {
    const business = await this.getBusinessBySlug(businessSlug);
    const row = await this.findStaffRow(business.id, staffId);

    if (!row) {
      throw new NotFoundException("Staff member not found");
    }

    return toStaffMember(row);
  }

  async createBusinessStaff(
    businessSlug: string,
    body: SaveStaffBody
  ): Promise<StaffMember> {
    const business = await this.getBusinessBySlug(businessSlug);
    const normalized = normalizeStaffBody(body, true);
    const email = normalized.email ?? "";
    const username = normalized.username ?? "";
    const canLogin = normalized.canLogin ?? true;
    const loginEmail = email || `${username}@tj-pos.local`;

    await this.assertEmailAvailable(business.id, email);
    if (username) {
      await this.assertUsernameAvailable(business.id, username);
    }

    const staffId = randomUUID();
    const userId = canLogin ? randomUUID() : null;
    const passwordHash = canLogin ? await bcrypt.hash(normalized.password ?? "", 12) : null;

    await this.database.sql.begin(async (sql) => {
      if (canLogin && userId && passwordHash) {
        await sql`
        INSERT INTO users (id, name, username, email, password_hash, status)
        VALUES (
          ${userId},
          ${normalized.name ?? ""},
          ${username},
          ${loginEmail},
          ${passwordHash},
          ${normalized.status === "inactive" ? "inactive" : "active"}
        )
      `;

        await sql`
        INSERT INTO business_users (business_id, user_id, role, permissions, status)
        VALUES (
          ${business.id},
          ${userId},
          ${normalized.role ?? "Thu ngân"},
          ${getPermissionsForRole(normalized.role ?? "Thu ngân")},
          ${normalized.status === "inactive" ? "inactive" : "active"}
        )
      `;
      }

      await sql`
        INSERT INTO staff_members (
          id,
          business_id,
          user_id,
          username,
          can_login,
          name,
          email,
          phone,
          role,
          shift,
          shift_time,
          status,
          avatar_url,
          gender,
          birthday,
          address,
          identity_number,
          join_date,
          note,
          revenue,
          orders_count,
          rating,
          created_at,
          updated_at
        )
        VALUES (
          ${staffId},
          ${business.id},
          ${userId},
          ${username},
          ${canLogin},
          ${normalized.name ?? ""},
          ${email},
          ${normalized.phone ?? ""},
          ${normalized.role ?? "Thu ngân"},
          ${normalized.shift ?? "Ca sáng"},
          ${normalized.shiftTime ?? "06:00 - 14:00"},
          ${normalized.status ?? "active"},
          ${normalized.avatar ?? fallbackAvatar},
          ${normalized.gender ?? "Khác"},
          ${normalized.birthday ?? ""},
          ${normalized.address ?? ""},
          ${normalized.identityNumber ?? ""},
          ${normalized.joinDate ?? new Date().toLocaleDateString("vi-VN")},
          ${normalized.note ?? "-"},
          0,
          0,
          0,
          now(),
          now()
        )
      `;
    });

    return this.getBusinessStaff(businessSlug, staffId);
  }

  async updateBusinessStaff(
    businessSlug: string,
    staffId: string,
    body: SaveStaffBody
  ): Promise<StaffMember> {
    const business = await this.getBusinessBySlug(businessSlug);
    const current = await this.findStaffRow(business.id, staffId);

    if (!current) {
      throw new NotFoundException("Staff member not found");
    }

    const normalized = normalizeStaffBody(body, false);
    const nextEmail = normalized.email ?? current.email;
    const nextUsername = normalized.username ?? current.username;
    const nextCanLogin = normalized.canLogin ?? current.can_login;
    const nextLoginEmail = nextEmail || `${nextUsername}@tj-pos.local`;

    await this.assertEmailAvailable(business.id, nextEmail, staffId);
    if (nextUsername) {
      await this.assertUsernameAvailable(business.id, nextUsername, staffId);
    }
    const nextStatus = normalized.status ?? current.status;
    const passwordHash = normalized.password
      ? await bcrypt.hash(normalized.password, 12)
      : null;

    await this.database.sql.begin(async (sql) => {
      await sql`
        UPDATE staff_members
        SET
          username = ${nextUsername},
          can_login = ${nextCanLogin},
          name = ${normalized.name ?? current.name},
          email = ${nextEmail},
          phone = ${normalized.phone ?? current.phone},
          role = ${normalized.role ?? current.role},
          shift = ${normalized.shift ?? current.shift},
          shift_time = ${normalized.shiftTime ?? current.shift_time},
          status = ${nextStatus},
          avatar_url = ${normalized.avatar ?? current.avatar_url},
          gender = ${normalized.gender ?? current.gender},
          birthday = ${normalized.birthday ?? current.birthday},
          address = ${normalized.address ?? current.address},
          identity_number = ${normalized.identityNumber ?? current.identity_number},
          join_date = ${normalized.joinDate ?? current.join_date},
          note = ${normalized.note ?? current.note},
          updated_at = now()
        WHERE id = ${staffId}
          AND business_id = ${business.id}
          AND deleted_at IS NULL
      `;

      if (current.user_id) {
        await sql`
          UPDATE users
          SET
            name = ${normalized.name ?? current.name},
            username = ${nextUsername},
            email = ${nextLoginEmail},
            status = ${nextCanLogin && nextStatus !== "inactive" ? "active" : "inactive"},
            password_hash = COALESCE(${passwordHash}, password_hash),
            updated_at = now()
          WHERE id = ${current.user_id}
        `;

        await sql`
          UPDATE business_users
          SET
            role = ${normalized.role ?? current.role},
            permissions = ${getPermissionsForRole(normalized.role ?? current.role)},
            status = ${nextCanLogin && nextStatus !== "inactive" ? "active" : "inactive"},
            updated_at = now()
          WHERE business_id = ${business.id}
            AND user_id = ${current.user_id}
        `;
      } else if (nextCanLogin) {
        if (!nextUsername || !normalized.password) {
          throw new BadRequestException("Staff username and password are required to enable login");
        }

        const userId = randomUUID();
        const nextPasswordHash = await bcrypt.hash(normalized.password, 12);

        await sql`
          INSERT INTO users (id, name, username, email, password_hash, status)
          VALUES (
            ${userId},
            ${normalized.name ?? current.name},
            ${nextUsername},
            ${nextLoginEmail},
            ${nextPasswordHash},
            ${nextStatus === "inactive" ? "inactive" : "active"}
          )
        `;

        await sql`
          INSERT INTO business_users (business_id, user_id, role, permissions, status)
          VALUES (
            ${business.id},
            ${userId},
            ${normalized.role ?? current.role},
            ${getPermissionsForRole(normalized.role ?? current.role)},
            ${nextStatus === "inactive" ? "inactive" : "active"}
          )
        `;

        await sql`
          UPDATE staff_members
          SET user_id = ${userId},
            updated_at = now()
          WHERE id = ${staffId}
            AND business_id = ${business.id}
        `;
      }
    });

    return this.getBusinessStaff(businessSlug, staffId);
  }

  async deleteBusinessStaff(
    businessSlug: string,
    staffId: string
  ): Promise<DeleteStaffResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<{ id: string; user_id: string | null }[]>`
      UPDATE staff_members
      SET deleted_at = now(),
        status = 'inactive',
        updated_at = now()
      WHERE id = ${staffId}
        AND business_id = ${business.id}
        AND deleted_at IS NULL
      RETURNING id, user_id
    `;

    if (!row) {
      throw new NotFoundException("Staff member not found");
    }

    if (row.user_id) {
      await this.database.sql`
        UPDATE users
        SET status = 'inactive',
          updated_at = now()
        WHERE id = ${row.user_id}
      `;

      await this.database.sql`
        UPDATE business_users
        SET status = 'inactive',
          updated_at = now()
        WHERE business_id = ${business.id}
          AND user_id = ${row.user_id}
      `;
    }

    return {
      id: row.id,
      deleted: true
    };
  }

  private staffSelectFields() {
    return this.database.sql`
      sm.id,
      sm.user_id,
      sm.username,
      sm.can_login,
      sm.name,
      sm.email,
      sm.phone,
      sm.role,
      sm.shift,
      sm.shift_time,
      sm.status,
      sm.avatar_url,
      sm.gender,
      sm.birthday,
      sm.address,
      sm.identity_number,
      sm.join_date,
      sm.note,
      sm.revenue::text,
      sm.orders_count::text,
      sm.rating::text,
      sm.created_at,
      sm.updated_at
    `;
  }

  private async getBusinessBySlug(slug: string) {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id
      FROM businesses
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private async findStaffRow(businessId: string, staffId: string) {
    const [row] = await this.database.sql<StaffRow[]>`
      SELECT ${this.staffSelectFields()}
      FROM staff_members sm
      WHERE sm.business_id = ${businessId}
        AND sm.id = ${staffId}
        AND sm.deleted_at IS NULL
      LIMIT 1
    `;

    return row ?? null;
  }

  private async assertEmailAvailable(
    businessId: string,
    email: string,
    excludeStaffId?: string
  ) {
    if (!email) {
      return;
    }

    const [existing] = await this.database.sql<{ id: string }[]>`
      SELECT id
      FROM staff_members
      WHERE business_id = ${businessId}
        AND lower(email) = lower(${email})
        AND deleted_at IS NULL
        AND (${excludeStaffId ?? null}::uuid IS NULL OR id <> ${excludeStaffId ?? null})
      LIMIT 1
    `;

    if (existing) {
      throw new ConflictException("Staff email already exists");
    }
  }

  private async assertUsernameAvailable(
    businessId: string,
    username: string,
    excludeStaffId?: string
  ) {
    const [existing] = await this.database.sql<{ id: string }[]>`
      SELECT id
      FROM staff_members
      WHERE business_id = ${businessId}
        AND lower(username) = lower(${username})
        AND deleted_at IS NULL
        AND (${excludeStaffId ?? null}::uuid IS NULL OR id <> ${excludeStaffId ?? null})
      LIMIT 1
    `;

    if (existing) {
      throw new ConflictException("Staff username already exists");
    }

    const [existingUser] = await this.database.sql<{ id: string }[]>`
      SELECT u.id
      FROM users u
      LEFT JOIN staff_members sm ON sm.user_id = u.id
        AND sm.business_id = ${businessId}
        AND sm.deleted_at IS NULL
      WHERE lower(u.username) = lower(${username})
        AND (
          ${excludeStaffId ?? null}::uuid IS NULL
          OR sm.id IS NULL
          OR sm.id <> ${excludeStaffId ?? null}
        )
      LIMIT 1
    `;

    if (existingUser) {
      throw new ConflictException("Staff username already exists");
    }
  }

  private async ensureStaffSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS staff_members (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        user_id uuid NULL,
        username varchar NOT NULL DEFAULT '',
        can_login boolean NOT NULL DEFAULT true,
        name varchar NOT NULL,
        email varchar NOT NULL,
        phone varchar NOT NULL,
        role varchar NOT NULL,
        shift varchar NOT NULL,
        shift_time varchar NOT NULL,
        status varchar NOT NULL DEFAULT 'active',
        avatar_url text NULL,
        gender varchar NOT NULL DEFAULT '',
        birthday varchar NOT NULL DEFAULT '',
        address text NOT NULL DEFAULT '',
        identity_number varchar NOT NULL DEFAULT '',
        join_date varchar NOT NULL DEFAULT '',
        note text NULL,
        revenue numeric(14,2) NOT NULL DEFAULT 0,
        orders_count int NOT NULL DEFAULT 0,
        rating numeric(3,1) NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      )
    `;

    await this.database.sql`
      ALTER TABLE staff_members
      ADD COLUMN IF NOT EXISTS user_id uuid NULL
    `;

    await this.database.sql`
      ALTER TABLE staff_members
      ADD COLUMN IF NOT EXISTS username varchar NOT NULL DEFAULT ''
    `;

    await this.database.sql`
      ALTER TABLE staff_members
      ADD COLUMN IF NOT EXISTS can_login boolean NOT NULL DEFAULT true
    `;

    await this.database.sql`
      DROP INDEX IF EXISTS staff_members_business_email_idx
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS staff_members_business_email_idx
      ON staff_members (business_id, lower(email))
      WHERE deleted_at IS NULL AND email <> ''
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS staff_members_business_username_idx
      ON staff_members (business_id, lower(username))
      WHERE deleted_at IS NULL AND username <> ''
    `;
  }

}

function normalizeStaffBody(body: SaveStaffBody, creating: boolean) {
  const status = isStaffStatus(body.status) ? body.status : undefined;
  const canLogin = false;
  const name = normalizeText(body.name);
  const username = undefined;
  const password = undefined;
  const email = normalizeText(body.email)?.toLowerCase();
  const phone = normalizeText(body.phone);

  if (creating && !name) {
    throw new BadRequestException("Staff name is required");
  }

  if (email && !email.includes("@")) {
    throw new BadRequestException("Staff email is invalid");
  }

  return {
    name,
    username,
    password,
    canLogin,
    email,
    phone,
    role: normalizeText(body.role) ?? (creating ? "Thu ngân" : undefined),
    shift: normalizeText(body.shift) ?? (creating ? "Ca sáng" : undefined),
    shiftTime: normalizeText(body.shiftTime) ?? (creating ? "06:00 - 14:00" : undefined),
    status: status ?? (creating ? "active" : undefined),
    avatar: creating ? fallbackAvatar : undefined,
    gender: normalizeText(body.gender) ?? (creating ? "Khác" : undefined),
    birthday: normalizeText(body.birthday) ?? (creating ? "" : undefined),
    address: normalizeText(body.address) ?? (creating ? "" : undefined),
    identityNumber: normalizeText(body.identityNumber) ?? (creating ? "" : undefined),
    joinDate: normalizeText(body.joinDate) ?? (creating ? new Date().toLocaleDateString("vi-VN") : undefined),
    note: normalizeText(body.note) ?? (creating ? "-" : undefined)
  };
}

function normalizeText(value?: string | null) {
  const text = value?.trim();

  return text ? text : undefined;
}

function isStaffStatus(value?: string): value is StaffStatus {
  return Boolean(value && staffStatusSet.has(value as StaffStatus));
}

function toStaffMember(row: StaffRow): StaffMember {
  return {
    id: row.id,
    username: row.username || row.email.split("@")[0],
    canLogin: row.can_login,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    shift: row.shift,
    shiftTime: row.shift_time,
    status: row.status,
    avatar: row.avatar_url || fallbackAvatar,
    gender: row.gender,
    birthday: row.birthday,
    address: row.address,
    identityNumber: row.identity_number,
    joinDate: row.join_date,
    note: row.note || "-",
    revenue: Number(row.revenue),
    orders: Number(row.orders_count),
    rating: Number(row.rating),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

function getPermissionsForRole(role: string) {
  if (role === "Chủ quán") {
    return [
      "dashboard:read",
      "items:manage",
      "inventory:manage",
      "orders:manage",
      "payments:manage",
      "reports:read",
      "staff:manage",
      "settings:manage"
    ];
  }

  if (role === "Quản lý") {
    return [
      "dashboard:read",
      "items:manage",
      "inventory:manage",
      "orders:manage",
      "payments:manage",
      "reports:read",
      "staff:manage",
      "settings:manage"
    ];
  }

  if (role === "Thu ngân") {
    return ["orders:manage", "payments:manage", "reports:read"];
  }

  if (role === "Pha chế") {
    return ["orders:read", "kitchen:manage"];
  }

  if (role === "Phục vụ") {
    return ["orders:manage", "tables:manage"];
  }

  if (role === "Kho") {
    return ["inventory:manage", "items:read"];
  }

  if (role === "Nhân viên chung") {
    return ["orders:read"];
  }

  return ["orders:read"];
}

function buildStaffKpis(staff: StaffMember[]): StaffKpi[] {
  const active = staff.filter((member) => member.status === "active").length;
  const inactive = staff.filter((member) => member.status === "inactive").length;
  const onLeave = staff.filter((member) => member.status === "on-leave").length;

  return [
    {
      id: "total",
      title: "Tổng nhân viên",
      value: String(staff.length),
      subtitle: "nhân viên",
      tone: "brown"
    },
    {
      id: "active",
      title: "Đang làm việc",
      value: String(active),
      subtitle: "nhân viên",
      tone: "green"
    },
    {
      id: "inactive",
      title: "Nghỉ việc",
      value: String(inactive),
      subtitle: "nhân viên",
      tone: "amber"
    },
    {
      id: "leave",
      title: "Tạm nghỉ",
      value: String(onLeave),
      subtitle: "nhân viên",
      tone: "purple"
    }
  ];
}
