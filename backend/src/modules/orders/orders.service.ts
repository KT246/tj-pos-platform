import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { Sql, TransactionSql } from "postgres";

import { DatabaseService } from "../../database/database.service";
import type {
  BusinessOrder,
  BusinessOrderItem,
  BusinessOrderReceipt,
  BusinessOrdersResponse,
  BusinessPayment,
  CreateBusinessOrderBody,
  CreateOrderItemBody,
  CreateOrderPaymentBody,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  UpdateOrderItemBody
} from "./orders.dto";

type BusinessRow = {
  id: string;
  slug: string;
  name: string;
};

type OrderRow = {
  id: string;
  order_no: string;
  pos_type: string;
  order_type: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: string;
  discount_amount: string;
  discount_label: string | null;
  tax_amount: string;
  total: string;
  table_label: string | null;
  customer_id: string | null;
  customer_name: string | null;
  cashier_name: string | null;
  loyalty_points_redeemed: string;
  loyalty_points_earned: string;
  loyalty_discount_amount: string;
  note: string | null;
  client_request_id: string | null;
  created_at: Date;
  updated_at: Date;
};

type OrderItemRow = {
  id: string;
  item_id: string | null;
  name_snapshot: string;
  image_url: string | null;
  price_snapshot: string;
  quantity: string;
  line_total: string;
  note: string | null;
};

type PaymentRow = {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount_paid: string;
  change_amount: string;
  debt_amount: string;
  paid_at: Date;
};

type CustomerPointSettingsRow = {
  customer_settings: unknown;
};

const defaultPointEarnAmount = 10000;

const orderStatusSet = new Set<OrderStatus>([
  "draft",
  "open",
  "held",
  "paid",
  "partially_paid",
  "debt",
  "cancelled",
  "voided",
  "refunded"
]);
const paymentStatusSet = new Set<PaymentStatus>([
  "unpaid",
  "paid",
  "partially_paid",
  "debt",
  "voided",
  "refunded"
]);
const paymentMethodSet = new Set<PaymentMethod>(["cash", "bank-transfer", "qr-code"]);
const editableOrderStatusSet = new Set<OrderStatus>(["draft", "open", "held"]);

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.ensureOrdersSchema();
  }

  async createBusinessOrder(
    businessSlug: string,
    body: CreateBusinessOrderBody
  ): Promise<BusinessOrder> {
    const business = await this.getBusinessBySlug(businessSlug);
    const items = body.items ?? [];

    if (!items.length) {
      throw new BadRequestException("Order must have at least one item");
    }

    const normalizedItems = items.map((item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.price) || 0);
      const name = normalizeOptionalText(item.name);

      if (!name) {
        throw new BadRequestException("Order item name is required");
      }

      return {
        id: randomUUID(),
        itemId: normalizeUuidText(item.itemId),
        name,
        price,
        quantity,
        lineTotal: price * quantity,
        note: normalizeOptionalText(item.note)
      };
    });
    const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const loyaltyPointsRedeemed = Math.max(0, Math.floor(Number(body.loyaltyPointsRedeemed) || 0));
    const loyaltyDiscountAmount = Math.max(0, Number(body.loyaltyDiscountAmount) || 0);
    const discountAmount = Math.max(0, Number(body.discountAmount) || 0);
    const discountLabel = normalizeOptionalText(body.discountLabel);
    const taxAmount = Math.max(0, Number(body.taxAmount) || 0);
    const total = Math.max(0, subtotal - discountAmount + taxAmount);
    const orderId = randomUUID();
    const orderNo = await this.createOrderNo(business.id);
    const status = normalizeOrderStatus(body.status, "open");
    const paymentStatus = normalizePaymentStatus(body.paymentStatus, "unpaid");
    const clientRequestId = normalizeOptionalText(body.clientRequestId);
    const cashierName = normalizeOptionalText(body.cashierName);

    if (clientRequestId) {
      const [existingOrder] = await this.database.sql<OrderRow[]>`
        SELECT ${this.orderSelectFields()}
        FROM orders o
        WHERE o.business_id = ${business.id}
          AND o.client_request_id = ${clientRequestId}
        LIMIT 1
      `;

      if (existingOrder) {
        return this.hydrateOrder(existingOrder);
      }
    }

    await this.database.sql.begin(async (sql) => {
      await sql`
        INSERT INTO orders (
          id,
          business_id,
          order_no,
          pos_type,
          order_type,
          status,
          payment_status,
          subtotal,
          discount_amount,
          discount_label,
          tax_amount,
          total,
          table_label,
          customer_id,
          customer_name,
          cashier_name,
          loyalty_points_redeemed,
          loyalty_points_earned,
          loyalty_discount_amount,
          note,
          client_request_id,
          created_at,
          updated_at
        )
        VALUES (
          ${orderId},
          ${business.id},
          ${orderNo},
          ${body.posType || "cafe"},
          ${body.orderType || "ນັ່ງກິນທີ່ຮ້ານ"},
          ${status},
          ${paymentStatus},
          ${subtotal},
          ${discountAmount},
          ${discountLabel},
          ${taxAmount},
          ${total},
          ${normalizeOptionalText(body.tableLabel)},
          ${normalizeUuidText(body.customerId)},
          ${normalizeOptionalText(body.customerName)},
          ${cashierName},
          ${loyaltyPointsRedeemed},
          0,
          ${loyaltyDiscountAmount},
          ${normalizeOptionalText(body.note)},
          ${clientRequestId},
          now(),
          now()
        )
      `;

      for (const item of normalizedItems) {
        await sql`
          INSERT INTO order_items (
            id,
            order_id,
            item_id,
            name_snapshot,
            price_snapshot,
            quantity,
            line_total,
            note
          )
          VALUES (
            ${item.id},
            ${orderId},
            ${item.itemId},
            ${item.name},
            ${item.price},
            ${item.quantity},
            ${item.lineTotal},
            ${item.note}
          )
        `;
      }
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async listBusinessOrders(
    businessSlug: string,
    query: { status?: string }
  ): Promise<BusinessOrdersResponse> {
    const business = await this.getBusinessBySlug(businessSlug);
    const status = normalizeOptionalOrderStatus(query.status);
    const rows = status
      ? await this.database.sql<OrderRow[]>`
          SELECT ${this.orderSelectFields()}
          FROM orders o
          WHERE o.business_id = ${business.id}
            AND o.status = ${status}
          ORDER BY o.created_at DESC
          LIMIT 100
        `
      : await this.database.sql<OrderRow[]>`
          SELECT ${this.orderSelectFields()}
          FROM orders o
          WHERE o.business_id = ${business.id}
          ORDER BY o.created_at DESC
          LIMIT 100
        `;

    return {
      orders: await Promise.all(rows.map((row) => this.hydrateOrder(row)))
    };
  }

  async getBusinessOrder(businessSlug: string, orderId: string): Promise<BusinessOrder> {
    const business = await this.getBusinessBySlug(businessSlug);
    const [row] = await this.database.sql<OrderRow[]>`
      SELECT ${this.orderSelectFields()}
      FROM orders o
      WHERE o.business_id = ${business.id}
        AND o.id = ${orderId}
      LIMIT 1
    `;

    if (!row) {
      throw new NotFoundException("Order not found");
    }

    return this.hydrateOrder(row);
  }

  async updateBusinessOrderStatus(
    businessSlug: string,
    orderId: string,
    status?: string
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    const normalizedStatus = normalizeOrderStatus(status, "open");

    if (["paid", "voided", "refunded", "partially_paid", "debt"].includes(normalizedStatus)) {
      throw new BadRequestException(
        "Use payment, void, or refund endpoints for financial order states"
      );
    }

    this.assertEditableOrder(order);

    await this.database.sql`
      UPDATE orders
      SET status = ${normalizedStatus},
        updated_at = now()
      WHERE id = ${order.id}
    `;

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async updateBusinessOrderDraft(
    businessSlug: string,
    orderId: string,
    body: CreateBusinessOrderBody
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertEditableOrder(order);

    if (order.paymentStatus !== "unpaid") {
      throw new BadRequestException("Only unpaid orders can be updated");
    }

    const items = body.items ?? [];

    if (!items.length) {
      throw new BadRequestException("Order must have at least one item");
    }

    const normalizedItems = items.map((item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.price) || 0);
      const name = normalizeOptionalText(item.name);

      if (!name) {
        throw new BadRequestException("Order item name is required");
      }

      return {
        id: randomUUID(),
        itemId: normalizeUuidText(item.itemId),
        name,
        price,
        quantity,
        lineTotal: price * quantity,
        note: normalizeOptionalText(item.note)
      };
    });
    const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const loyaltyPointsRedeemed = Math.max(0, Math.floor(Number(body.loyaltyPointsRedeemed) || 0));
    const loyaltyDiscountAmount = Math.max(0, Number(body.loyaltyDiscountAmount) || 0);
    const discountAmount = Math.max(0, Number(body.discountAmount) || 0);
    const discountLabel = normalizeOptionalText(body.discountLabel);
    const taxAmount = Math.max(0, Number(body.taxAmount) || 0);
    const total = Math.max(0, subtotal - discountAmount + taxAmount);
    const cashierName = normalizeOptionalText(body.cashierName) ?? order.cashierName;

    await this.database.sql.begin(async (sql) => {
      await sql`
        UPDATE orders
        SET
          pos_type = ${body.posType || order.posType},
          order_type = ${body.orderType || order.orderType},
          subtotal = ${subtotal},
          discount_amount = ${discountAmount},
          discount_label = ${discountLabel},
          tax_amount = ${taxAmount},
          total = ${total},
          table_label = ${normalizeOptionalText(body.tableLabel) ?? order.tableLabel},
          customer_id = ${normalizeUuidText(body.customerId) ?? order.customerId},
          customer_name = ${normalizeOptionalText(body.customerName) ?? order.customerName},
          cashier_name = ${cashierName},
          loyalty_points_redeemed = ${loyaltyPointsRedeemed},
          loyalty_discount_amount = ${loyaltyDiscountAmount},
          note = ${normalizeOptionalText(body.note)},
          updated_at = now()
        WHERE id = ${order.id}
      `;

      await sql`
        DELETE FROM order_items
        WHERE order_id = ${order.id}
      `;

      for (const item of normalizedItems) {
        await sql`
          INSERT INTO order_items (
            id,
            order_id,
            item_id,
            name_snapshot,
            price_snapshot,
            quantity,
            line_total,
            note
          )
          VALUES (
            ${item.id},
            ${order.id},
            ${item.itemId},
            ${item.name},
            ${item.price},
            ${item.quantity},
            ${item.lineTotal},
            ${item.note}
          )
        `;
      }
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async updateBusinessOrderTable(
    businessSlug: string,
    orderId: string,
    tableLabel?: string | null
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertEditableOrder(order);

    await this.database.sql`
      UPDATE orders
      SET table_label = ${normalizeOptionalText(tableLabel)},
        updated_at = now()
      WHERE id = ${order.id}
    `;

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async addBusinessOrderItem(
    businessSlug: string,
    orderId: string,
    body: CreateOrderItemBody
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertEditableOrder(order);
    const item = this.normalizeOrderItemBody(body);

    await this.database.sql.begin(async (sql) => {
      await sql`
        INSERT INTO order_items (
          id,
          order_id,
          item_id,
          name_snapshot,
          price_snapshot,
          quantity,
          line_total,
          note
        )
        VALUES (
          ${item.id},
          ${order.id},
          ${item.itemId},
          ${item.name},
          ${item.price},
          ${item.quantity},
          ${item.lineTotal},
          ${item.note}
        )
      `;

      await this.recalculateOrderTotals(sql, order.id);
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async updateBusinessOrderItem(
    businessSlug: string,
    orderId: string,
    orderItemId: string,
    body: UpdateOrderItemBody
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertEditableOrder(order);
    const quantity = Math.max(1, Number(body.quantity) || 1);
    const note = normalizeOptionalText(body.note);

    await this.database.sql.begin(async (sql) => {
      const rows = await sql<{ id: string }[]>`
        UPDATE order_items
        SET quantity = ${quantity},
          line_total = price_snapshot * ${quantity},
          note = ${note}
        WHERE id = ${orderItemId}
          AND order_id = ${order.id}
        RETURNING id
      `;

      if (!rows.length) {
        throw new NotFoundException("Order item not found");
      }

      await this.recalculateOrderTotals(sql, order.id);
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async removeBusinessOrderItem(
    businessSlug: string,
    orderId: string,
    orderItemId: string
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertEditableOrder(order);

    await this.database.sql.begin(async (sql) => {
      const rows = await sql<{ id: string }[]>`
        DELETE FROM order_items
        WHERE id = ${orderItemId}
          AND order_id = ${order.id}
        RETURNING id
      `;

      if (!rows.length) {
        throw new NotFoundException("Order item not found");
      }

      await this.recalculateOrderTotals(sql, order.id);
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async sendBusinessOrderToKitchen(
    businessSlug: string,
    orderId: string
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertEditableOrder(order);

    await this.database.sql`
      UPDATE orders
      SET status = 'open',
        updated_at = now()
      WHERE id = ${order.id}
    `;

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async cancelBusinessOrder(
    businessSlug: string,
    orderId: string
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertEditableOrder(order);

    await this.database.sql`
      UPDATE orders
      SET status = 'cancelled',
        updated_at = now()
      WHERE id = ${order.id}
    `;

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async voidBusinessOrder(
    businessSlug: string,
    orderId: string
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertPaidOrder(order, "Only paid orders can be voided");

    await this.database.sql.begin(async (sql) => {
      await sql`
        UPDATE payments
        SET status = 'voided'
        WHERE order_id = ${order.id}
      `;

      await sql`
        UPDATE orders
        SET status = 'voided',
          payment_status = 'voided',
          updated_at = now()
        WHERE id = ${order.id}
      `;

      await this.reverseCustomerLoyalty(sql, order, "VOID");
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async refundBusinessOrder(
    businessSlug: string,
    orderId: string
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);
    this.assertPaidOrder(order, "Only paid orders can be refunded");

    await this.database.sql.begin(async (sql) => {
      await sql`
        UPDATE payments
        SET status = 'refunded'
        WHERE order_id = ${order.id}
      `;

      await sql`
        UPDATE orders
        SET status = 'refunded',
          payment_status = 'refunded',
          updated_at = now()
        WHERE id = ${order.id}
      `;

      await this.reverseCustomerLoyalty(sql, order, "REFUND");
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async createBusinessOrderPayment(
    businessSlug: string,
    orderId: string,
    body: CreateOrderPaymentBody
  ): Promise<BusinessOrder> {
    const order = await this.getBusinessOrder(businessSlug, orderId);

    if (["cancelled", "voided", "refunded"].includes(order.status)) {
      throw new BadRequestException("Cancelled, voided, or refunded orders cannot be paid");
    }

    const paymentLines = normalizePaymentLines(body);
    const amountPaid = paymentLines.reduce((sum, payment) => sum + payment.amountPaid, 0);
    const fallbackStatus: PaymentStatus = amountPaid >= order.total
      ? "paid"
      : amountPaid > 0
        ? "partially_paid"
        : "debt";
    const paymentStatus = normalizePaymentStatus(body.paymentStatus, fallbackStatus);
    const cashierName = normalizeOptionalText(body.cashierName) ?? order.cashierName;
    const pointSettings = await this.getCustomerPointSettings(businessSlug);
    const changeAmount = paymentStatus === "debt"
      ? 0
      : Math.max(0, amountPaid - order.total);
    const debtAmount = paymentStatus === "paid"
      ? 0
      : Math.max(0, order.total - amountPaid);
    const orderStatus: OrderStatus = paymentStatus === "paid"
      ? "paid"
      : paymentStatus === "partially_paid"
        ? "partially_paid"
        : "debt";
    let loyaltyPointsEarned = 0;

    if (order.paymentStatus === "paid") {
      throw new BadRequestException("Order is already paid");
    }

    await this.database.sql.begin(async (sql) => {
      let remainingChangeAmount = changeAmount;

      for (const payment of paymentLines) {
        const lineChangeAmount = payment.method === "cash" ? remainingChangeAmount : 0;
        remainingChangeAmount = Math.max(0, remainingChangeAmount - lineChangeAmount);

        await sql`
          INSERT INTO payments (
            id,
            order_id,
            method,
            status,
            amount_paid,
            change_amount,
            debt_amount,
            paid_at
          )
          VALUES (
            ${randomUUID()},
            ${order.id},
            ${payment.method},
            ${paymentStatus},
            ${payment.amountPaid},
            ${lineChangeAmount},
            ${debtAmount},
            now()
          )
        `;
      }

      if (paymentStatus === "paid" && order.customerId) {
        const [customer] = await sql<{ id: string; points: number }[]>`
          SELECT id, points
          FROM pos_customers
          WHERE id = ${order.customerId}
            AND deleted_at IS NULL
          FOR UPDATE
        `;

        if (!customer) {
          throw new BadRequestException("Customer not found for loyalty");
        }

        if (customer.points < order.loyaltyPointsRedeemed) {
          throw new BadRequestException("Customer does not have enough points");
        }

        loyaltyPointsEarned = Math.floor(
          (order.total + order.loyaltyDiscountAmount) / pointSettings.earnAmount
        );

        await sql`
          UPDATE pos_customers
          SET points = points - ${order.loyaltyPointsRedeemed} + ${loyaltyPointsEarned},
            total_spent = total_spent + ${order.total},
            orders_count = orders_count + 1,
            last_order_at = ${new Date().toLocaleDateString("vi-VN")},
            updated_at = now()
          WHERE id = ${order.customerId}
        `;

        if (order.loyaltyPointsRedeemed > 0) {
          await sql`
            INSERT INTO customer_point_transactions (
              id,
              customer_id,
              order_id,
              type,
              points,
              amount_value,
              note,
              created_at
            )
            VALUES (
              ${randomUUID()},
              ${order.customerId},
              ${order.id},
              'REDEEM',
              ${-order.loyaltyPointsRedeemed},
              ${order.loyaltyDiscountAmount},
              'Redeem points for order discount',
              now()
            )
          `;
        }

        if (loyaltyPointsEarned > 0) {
          await sql`
            INSERT INTO customer_point_transactions (
              id,
              customer_id,
              order_id,
              type,
              points,
              amount_value,
              note,
              created_at
            )
            VALUES (
              ${randomUUID()},
              ${order.customerId},
              ${order.id},
              'EARN',
              ${loyaltyPointsEarned},
              ${order.total},
              'Earn points from paid order',
              now()
            )
          `;
        }
      }

      await sql`
        UPDATE orders
        SET status = ${orderStatus},
          payment_status = ${paymentStatus},
          cashier_name = ${cashierName},
          loyalty_points_earned = ${loyaltyPointsEarned},
          updated_at = now()
        WHERE id = ${order.id}
      `;
    });

    return this.getBusinessOrder(businessSlug, orderId);
  }

  async getBusinessOrderReceipt(
    businessSlug: string,
    orderId: string
  ): Promise<BusinessOrderReceipt> {
    const business = await this.getBusinessBySlug(businessSlug);
    const order = await this.getBusinessOrder(businessSlug, orderId);

    return {
      businessName: business.name,
      businessSlug: business.slug,
      order
    };
  }

  private async reverseCustomerLoyalty(
    sql: Sql | TransactionSql,
    order: BusinessOrder,
    type: "VOID" | "REFUND"
  ) {
    if (!order.customerId || (!order.loyaltyPointsEarned && !order.loyaltyPointsRedeemed)) {
      return;
    }

    await sql`
      UPDATE pos_customers
      SET points = GREATEST(0, points - ${order.loyaltyPointsEarned} + ${order.loyaltyPointsRedeemed}),
        total_spent = GREATEST(0, total_spent - ${order.total}),
        orders_count = GREATEST(0, orders_count - 1),
        updated_at = now()
      WHERE id = ${order.customerId}
        AND deleted_at IS NULL
    `;

    await sql`
      INSERT INTO customer_point_transactions (
        id,
        customer_id,
        order_id,
        type,
        points,
        amount_value,
        note,
        created_at
      )
      VALUES (
        ${randomUUID()},
        ${order.customerId},
        ${order.id},
        ${type},
        ${order.loyaltyPointsRedeemed - order.loyaltyPointsEarned},
        ${order.total},
        ${type === "VOID" ? "Reverse points from voided order" : "Reverse points from refunded order"},
        now()
      )
    `;
  }

  private async hydrateOrder(row: OrderRow): Promise<BusinessOrder> {
    const [itemRows, paymentRows] = await Promise.all([
      this.database.sql<OrderItemRow[]>`
        SELECT oi.id,
               oi.item_id,
               oi.name_snapshot,
               pi.image_url,
               oi.price_snapshot::text,
               oi.quantity::text,
               oi.line_total::text,
               oi.note
        FROM order_items oi
        LEFT JOIN items pi ON pi.id = oi.item_id
        WHERE oi.order_id = ${row.id}
        ORDER BY oi.created_at ASC
      `,
      this.database.sql<PaymentRow[]>`
        SELECT id, method, status, amount_paid::text, change_amount::text, debt_amount::text, paid_at
        FROM payments
        WHERE order_id = ${row.id}
        ORDER BY paid_at ASC
      `
    ]);

    return {
      id: row.id,
      orderNo: row.order_no,
      posType: row.pos_type,
      orderType: row.order_type,
      status: row.status,
      paymentStatus: row.payment_status,
      subtotal: Number(row.subtotal),
      discountAmount: Number(row.discount_amount),
      discountLabel: row.discount_label,
      taxAmount: Number(row.tax_amount),
      total: Number(row.total),
      tableLabel: row.table_label,
      customerId: row.customer_id,
      customerName: row.customer_name,
      cashierName: row.cashier_name,
      loyaltyPointsRedeemed: Number(row.loyalty_points_redeemed),
      loyaltyPointsEarned: Number(row.loyalty_points_earned),
      loyaltyDiscountAmount: Number(row.loyalty_discount_amount),
      note: row.note,
      clientRequestId: row.client_request_id,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      items: itemRows.map(toOrderItem),
      payments: paymentRows.map(toPayment)
    };
  }

  private async createOrderNo(businessId: string) {
    const [settings] = await this.database.sql<{ receipt_prefix: string | null }[]>`
      SELECT receipt_prefix
      FROM pos_business_settings
      WHERE business_id = ${businessId}
      LIMIT 1
    `;
    const prefix = normalizeReceiptPrefix(settings?.receipt_prefix);
    const [{ count }] = await this.database.sql<{ count: string }[]>`
      SELECT count(*)::text
      FROM orders
      WHERE business_id = ${businessId}
    `;
    const nextNumber = Number(count) + 1;

    return `${prefix}-${String(nextNumber).padStart(5, "0")}`;
  }

  private async getCustomerPointSettings(businessSlug: string) {
    const [settings] = await this.database.sql<CustomerPointSettingsRow[]>`
      SELECT ps.customer_settings
      FROM pos_business_settings ps
      JOIN businesses b ON b.id = ps.business_id
      WHERE b.slug = ${businessSlug}
      LIMIT 1
    `;
    const customerSettings = parseJsonValue(settings?.customer_settings);
    const earnAmount = isRecord(customerSettings)
      ? normalizePositiveInteger(customerSettings.earnAmount, defaultPointEarnAmount)
      : defaultPointEarnAmount;

    return { earnAmount };
  }

  private orderSelectFields() {
    return this.database.sql`
      o.id,
      o.order_no,
      o.pos_type,
      o.order_type,
      o.status,
      o.payment_status,
      o.subtotal::text,
      o.discount_amount::text,
      o.discount_label,
      o.tax_amount::text,
      o.total::text,
      o.table_label,
      o.customer_id,
      o.customer_name,
      o.cashier_name,
      o.loyalty_points_redeemed::text,
      o.loyalty_points_earned::text,
      o.loyalty_discount_amount::text,
      o.note,
      o.client_request_id,
      o.created_at,
      o.updated_at
    `;
  }

  private async getBusinessBySlug(slug: string) {
    const [business] = await this.database.sql<BusinessRow[]>`
      SELECT id, slug, name
      FROM businesses
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return business;
  }

  private assertEditableOrder(order: BusinessOrder) {
    if (!editableOrderStatusSet.has(order.status)) {
      throw new BadRequestException(
        "Order can only be edited while it is draft, open, or held"
      );
    }
  }

  private assertPaidOrder(order: BusinessOrder, message: string) {
    if (order.status !== "paid" || order.paymentStatus !== "paid") {
      throw new BadRequestException(message);
    }
  }

  private normalizeOrderItemBody(item: CreateOrderItemBody) {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const price = Math.max(0, Number(item.price) || 0);
    const name = normalizeOptionalText(item.name);

    if (!name) {
      throw new BadRequestException("Order item name is required");
    }

    return {
      id: randomUUID(),
      itemId: normalizeUuidText(item.itemId),
      name,
      price,
      quantity,
      lineTotal: price * quantity,
      note: normalizeOptionalText(item.note)
    };
  }

  private async recalculateOrderTotals(sql: Sql | TransactionSql, orderId: string) {
    await sql`
      UPDATE orders
      SET subtotal = totals.subtotal,
        total = GREATEST(0, totals.subtotal - discount_amount + tax_amount),
        updated_at = now()
      FROM (
        SELECT COALESCE(SUM(line_total), 0) AS subtotal
        FROM order_items
        WHERE order_id = ${orderId}
      ) totals
      WHERE orders.id = ${orderId}
    `;
  }

  private async ensureOrdersSchema() {
    await this.database.sql`
      CREATE TABLE IF NOT EXISTS orders (
        id uuid PRIMARY KEY,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        order_no varchar NOT NULL,
        pos_type varchar NOT NULL,
        order_type varchar NOT NULL,
        status varchar NOT NULL DEFAULT 'open',
        payment_status varchar NOT NULL DEFAULT 'unpaid',
        subtotal numeric(14,2) NOT NULL DEFAULT 0,
        discount_amount numeric(14,2) NOT NULL DEFAULT 0,
        discount_label varchar NULL,
        tax_amount numeric(14,2) NOT NULL DEFAULT 0,
        total numeric(14,2) NOT NULL DEFAULT 0,
        table_label varchar NULL,
        customer_id uuid NULL,
        customer_name varchar NULL,
        cashier_name varchar NULL,
        loyalty_points_redeemed int NOT NULL DEFAULT 0,
        loyalty_points_earned int NOT NULL DEFAULT 0,
        loyalty_discount_amount numeric(14,2) NOT NULL DEFAULT 0,
        note text NULL,
        client_request_id varchar NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS client_request_id varchar NULL
    `;

    await this.database.sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS discount_label varchar NULL
    `;

    await this.database.sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS note text NULL
    `;

    await this.database.sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS customer_id uuid NULL
    `;

    await this.database.sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS loyalty_points_redeemed int NOT NULL DEFAULT 0
    `;

    await this.database.sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS loyalty_points_earned int NOT NULL DEFAULT 0
    `;

    await this.database.sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS loyalty_discount_amount numeric(14,2) NOT NULL DEFAULT 0
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id uuid PRIMARY KEY,
        order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        item_id uuid NULL,
        name_snapshot varchar NOT NULL,
        price_snapshot numeric(14,2) NOT NULL DEFAULT 0,
        quantity numeric(14,3) NOT NULL DEFAULT 1,
        line_total numeric(14,2) NOT NULL DEFAULT 0,
        note text NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS payments (
        id uuid PRIMARY KEY,
        order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        method varchar NOT NULL,
        status varchar NOT NULL,
        amount_paid numeric(14,2) NOT NULL DEFAULT 0,
        change_amount numeric(14,2) NOT NULL DEFAULT 0,
        debt_amount numeric(14,2) NOT NULL DEFAULT 0,
        paid_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      CREATE TABLE IF NOT EXISTS customer_point_transactions (
        id uuid PRIMARY KEY,
        customer_id uuid NOT NULL,
        order_id uuid NULL,
        type varchar NOT NULL,
        points int NOT NULL,
        amount_value numeric(14,2) NOT NULL DEFAULT 0,
        note text NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await this.database.sql`
      CREATE INDEX IF NOT EXISTS orders_business_status_idx
      ON orders (business_id, status, created_at DESC)
    `;

    await this.database.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS orders_business_client_request_idx
      ON orders (business_id, client_request_id)
      WHERE client_request_id IS NOT NULL
    `;
  }
}

function toOrderItem(row: OrderItemRow): BusinessOrderItem {
  return {
    id: row.id,
    itemId: row.item_id,
    name: row.name_snapshot,
    imageUrl: row.image_url,
    price: Number(row.price_snapshot),
    quantity: Number(row.quantity),
    lineTotal: Number(row.line_total),
    note: row.note
  };
}

function toPayment(row: PaymentRow): BusinessPayment {
  return {
    id: row.id,
    method: row.method,
    status: row.status,
    amountPaid: Number(row.amount_paid),
    changeAmount: Number(row.change_amount),
    debtAmount: Number(row.debt_amount),
    paidAt: row.paid_at.toISOString()
  };
}

function normalizeOptionalText(value?: string | null) {
  const text = value?.trim();

  return text ? text : null;
}

function normalizeReceiptPrefix(value?: string | null) {
  const prefix = value?.trim().replace(/\s+/g, "-");

  return prefix || "POS";
}

function normalizeUuidText(value?: string | null) {
  const text = normalizeOptionalText(value);

  return text && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)
    ? text
    : null;
}

function parseJsonValue(value: unknown) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizePositiveInteger(value: unknown, fallback: number) {
  const numberValue = Number(value);

  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : fallback;
}

function normalizeOptionalOrderStatus(value?: string | null): OrderStatus | null {
  return value && orderStatusSet.has(value as OrderStatus) ? value as OrderStatus : null;
}

function normalizeOrderStatus(value: string | undefined, fallback: OrderStatus): OrderStatus {
  return value && orderStatusSet.has(value as OrderStatus) ? value as OrderStatus : fallback;
}

function normalizePaymentStatus(value: string | undefined, fallback: PaymentStatus): PaymentStatus {
  return value && paymentStatusSet.has(value as PaymentStatus) ? value as PaymentStatus : fallback;
}

function normalizePaymentMethod(value: string | undefined): PaymentMethod {
  return value && paymentMethodSet.has(value as PaymentMethod) ? value as PaymentMethod : "cash";
}

function normalizePaymentLines(body: CreateOrderPaymentBody): Array<{
  method: PaymentMethod;
  amountPaid: number;
}> {
  const lines = body.payments?.length
    ? body.payments
    : [{ method: body.method, amountPaid: body.amountPaid }];

  return lines
    .map((payment) => ({
      method: normalizePaymentMethod(payment.method),
      amountPaid: Math.max(0, Number(payment.amountPaid) || 0)
    }))
    .filter((payment) => payment.amountPaid > 0);
}
