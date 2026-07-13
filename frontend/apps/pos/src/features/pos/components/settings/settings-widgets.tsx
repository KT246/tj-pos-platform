import {
  ArrowRight,
  Bell,
  Building2,
  CreditCard,
  Database,
  Edit2,
  FileText,
  Globe2,
  Home,
  Palette,
  Percent,
  Printer,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  Upload,
  UsersRound,
} from "lucide-react"
import type { ComponentType } from "react"

import type {
  OpeningHour,
  SettingModuleCard as SettingModuleCardType,
  SettingSection,
  SettingSectionId,
} from "@/features/pos/data/cafe-settings"
import { cn } from "@/lib/utils"

const sectionIcons: Record<SettingSectionId, ComponentType<{ className?: string }>> = {
  business: Home,
  branches: Store,
  payments: CreditCard,
  printers: Printer,
  invoices: ReceiptText,
  taxes: ShieldCheck,
  permissions: UsersRound,
  appearance: Globe2,
  backup: Database,
  notifications: Bell,
}

const moduleIcons: Record<SettingSectionId, ComponentType<{ className?: string }>> = {
  business: Home,
  branches: Store,
  payments: CreditCard,
  printers: Printer,
  invoices: FileText,
  taxes: Percent,
  permissions: ShieldCheck,
  appearance: Palette,
  backup: Database,
  notifications: Bell,
}

const toneClass: Record<SettingModuleCardType["tone"], string> = {
  green: "bg-[#e6f7e9] text-[#2f8748]",
  amber: "bg-[#fff3d9] text-[#b86a14]",
  blue: "bg-[#e8f0ff] text-[#2f65d9]",
  purple: "bg-[#efe8ff] text-[#6652c8]",
  cyan: "bg-[#e5f6f5] text-[#12909a]",
  pink: "bg-[#ffe6f0] text-[#bc3e78]",
  red: "bg-[#ffe6e4] text-[#d33c32]",
  gray: "bg-[#edf0f3] text-[#526071]",
}

export function SettingsSideNav({
  sections,
  activeSectionId,
  onSelectSection,
}: {
  sections: SettingSection[]
  activeSectionId: SettingSectionId
  onSelectSection: (sectionId: SettingSectionId) => void
}) {
  return (
    <aside className="h-full rounded-xl border border-[#eadfce] bg-white p-3 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
      <nav className="space-y-1">
        {sections.map((section) => {
          const Icon = sectionIcons[section.id]
          const active = activeSectionId === section.id

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              className={cn(
                "flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-4 text-left text-sm font-black transition",
                active
                  ? "bg-[#f4eadc] text-[#4b321a] shadow-[0_8px_20px_rgba(80,54,27,0.08)]"
                  : "text-[#5f4a35] hover:bg-[#fbf4ea]",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {section.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export function BusinessInfoCard({
  business,
}: {
  business: {
    name: string
    phone: string
    address: string
    email: string
    coverImage: string
  }
}) {
  return (
    <section className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
      <h2 className="text-lg font-black text-[#3b2511]">Thông tin quán</h2>

      <div className="mt-5 flex gap-5">
        <img
          src={business.coverImage}
          alt={business.name}
          className="h-[130px] w-[150px] rounded-lg object-cover shadow-[0_14px_30px_rgba(80,54,27,0.12)]"
        />
        <div className="min-w-0 flex-1 space-y-3 text-sm font-semibold text-[#3b2511]">
          <InfoLine label="Tên quán" value={business.name} />
          <InfoLine label="Số điện thoại" value={business.phone} />
          <InfoLine label="Địa chỉ" value={business.address} />
          <InfoLine label="Email" value={business.email} />
        </div>
      </div>

      <button
        type="button"
        className="mt-5 flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#eadfce] bg-white px-4 text-sm font-black text-[#5f4a35] transition hover:border-[#caa77b] hover:bg-[#fbf4ea]"
      >
        <Edit2 className="h-4 w-4" />
        Chỉnh sửa
      </button>
    </section>
  )
}

export function OpeningHoursCard({ hours }: { hours: OpeningHour[] }) {
  return (
    <section className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
      <h2 className="text-lg font-black text-[#3b2511]">Giờ mở cửa</h2>
      <div className="mt-4 space-y-3">
        {hours.map((hour) => (
          <div
            key={hour.day}
            className="flex items-center justify-between text-sm font-bold text-[#5f4a35]"
          >
            <span>{hour.day}</span>
            <span className="text-[#3b2511]">{hour.time}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-5 flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#eadfce] bg-white px-4 text-sm font-black text-[#5f4a35] transition hover:border-[#caa77b] hover:bg-[#fbf4ea]"
      >
        <Edit2 className="h-4 w-4" />
        Chỉnh sửa
      </button>
    </section>
  )
}

export function LogoSettingsCard({
  logoUrl,
  uploadHint,
}: {
  logoUrl: string
  uploadHint: string
}) {
  return (
    <section className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
      <h2 className="text-lg font-black text-[#3b2511]">Logo quán</h2>
      <div className="mt-7 flex items-center justify-center gap-8">
        <div className="relative flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full bg-[#3b2511] shadow-[0_18px_34px_rgba(80,54,27,0.18)]">
          <img src={logoUrl} alt="Coffee Time" className="h-full w-full object-cover opacity-80" />
          <div className="absolute text-center text-white">
            <Building2 className="mx-auto h-9 w-9" />
            <p className="mt-2 font-serif text-2xl font-semibold">Coffee Time</p>
            <p className="mt-1 text-sm tracking-[0.25em]">POS</p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-[132px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d7c4ab] bg-[#fffaf4] text-[#5f4a35] transition hover:bg-[#fbf4ea]"
        >
          <Upload className="h-6 w-6" />
          <span className="mt-3 text-sm font-black">Thay đổi logo</span>
          <span className="mt-2 text-xs font-semibold text-[#8a7560]">{uploadHint}</span>
        </button>
      </div>
    </section>
  )
}

export function SettingModuleCard({ card }: { card: SettingModuleCardType }) {
  const Icon = moduleIcons[card.id] ?? Settings

  return (
    <article className="flex min-h-[154px] flex-col rounded-xl border border-[#eadfce] bg-white p-4 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            toneClass[card.tone],
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-[#3b2511]">{card.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-[#5f4a35]">
            {card.description}
          </p>
          <p className="mt-2 text-xs font-black text-[#158447]">{card.status}</p>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto flex h-10 cursor-pointer items-center justify-center rounded-lg border border-[#eadfce] bg-white text-sm font-black text-[#4b321a] transition hover:border-[#caa77b] hover:bg-[#fbf4ea]"
      >
        {card.actionLabel}
        <ArrowRight className="ml-auto mr-3 h-4 w-4" />
      </button>
    </article>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-[#7c6448]">{label}</p>
      <p className="mt-1 leading-5">{value}</p>
    </div>
  )
}
