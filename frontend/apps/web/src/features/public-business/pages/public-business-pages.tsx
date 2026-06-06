import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, Search, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const menuItems = [
  {
    slug: "iced-latte",
    name: "Iced Latte",
    price: "K 28,000",
    description: "Espresso, fresh milk, and ice.",
    category: "Coffee"
  },
  {
    slug: "green-tea-frappe",
    name: "Green Tea Frappe",
    price: "K 32,000",
    description: "Matcha, milk, cream, and crushed ice.",
    category: "Tea"
  },
  {
    slug: "butter-croissant",
    name: "Butter Croissant",
    price: "K 22,000",
    description: "Fresh baked croissant with butter aroma.",
    category: "Bakery"
  }
];

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function businessName(businessSlug: string) {
  return titleFromSlug(businessSlug) || "TJ Cafe Vientiane";
}

function PublicShell({
  businessSlug,
  children
}: {
  businessSlug: string;
  children: ReactNode;
}) {
  const name = businessName(businessSlug);

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href={`/b/${businessSlug}`} className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-lg font-black text-white">
              TJ
            </span>
            <span>
              <span className="block text-lg font-black">{name}</span>
              <span className="text-xs font-bold text-slate-500">Powered by TJ POS</span>
            </span>
          </Link>
          <Link
            href={`/b/${businessSlug}/menu`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
          >
            View Menu
          </Link>
        </div>
      </section>
      {children}
    </main>
  );
}

export function PublicBusinessLanding({ businessSlug }: { businessSlug: string }) {
  const name = businessName(businessSlug);

  return (
    <PublicShell businessSlug={businessSlug}>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
          <span className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
            Public Business Page
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-normal">{name}</h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
            Browse store information, opening hours, branches, and public menu.
            This page is view-only for customers and QR menu visitors.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/b/${businessSlug}/menu`}
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Open Menu
            </Link>
            <Link
              href={`/b/${businessSlug}/info`}
              className="rounded-md border border-blue-100 bg-white px-5 py-3 text-sm font-black text-blue-600 transition hover:bg-blue-50"
            >
              Store Info
            </Link>
          </div>
        </div>
        <StoreInfoCard businessSlug={businessSlug} />
      </section>
    </PublicShell>
  );
}

export function PublicMenuPage({
  businessSlug,
  branchSlug
}: {
  businessSlug: string;
  branchSlug?: string;
}) {
  return (
    <PublicShell businessSlug={businessSlug}>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black text-blue-600">
              {branchSlug ? titleFromSlug(branchSlug) : "All Branches"}
            </p>
            <h1 className="text-3xl font-black">Public Menu</h1>
          </div>
          <label className="relative w-full md:w-[320px]">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-md border border-blue-100 bg-white pr-4 pl-11 text-sm font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              placeholder="Search menu..."
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={`/b/${businessSlug}/menu/${item.slug}`}
              className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 h-32 rounded-md bg-[linear-gradient(135deg,#dbeafe,#eff6ff_45%,#fde68a)]" />
              <p className="text-xs font-black text-blue-600">{item.category}</p>
              <h2 className="mt-1 text-lg font-black">{item.name}</h2>
              <p className="mt-2 min-h-10 text-sm font-medium text-slate-600">
                {item.description}
              </p>
              <p className="mt-4 text-xl font-black text-slate-950">{item.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}

export function PublicMenuItemPage({
  businessSlug,
  itemSlug
}: {
  businessSlug: string;
  itemSlug: string;
}) {
  const item = menuItems.find((menuItem) => menuItem.slug === itemSlug) ?? menuItems[0];

  return (
    <PublicShell businessSlug={businessSlug}>
      <section className="mx-auto max-w-4xl px-5 py-8">
        <Link
          href={`/b/${businessSlug}/menu`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to menu
        </Link>
        <div className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
          <div className="h-64 bg-[linear-gradient(135deg,#dbeafe,#bfdbfe_40%,#fbbf24)]" />
          <div className="p-6">
            <p className="text-sm font-black text-blue-600">{item.category}</p>
            <h1 className="mt-1 text-4xl font-black">{item.name}</h1>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              {item.description}
            </p>
            <p className="mt-6 text-3xl font-black">{item.price}</p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

export function PublicInfoPage({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicShell businessSlug={businessSlug}>
      <section className="mx-auto max-w-4xl px-5 py-8">
        <StoreInfoCard businessSlug={businessSlug} />
      </section>
    </PublicShell>
  );
}

export function PublicBookingPage({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicShell businessSlug={businessSlug}>
      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
          <CalendarDays className="h-10 w-10 text-blue-600" />
          <h1 className="mt-4 text-3xl font-black">Booking</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            Booking or appointment can be enabled for supported POS types such as Beauty
            or Hospitality. This route is ready for frontend integration.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}

export function PublicQrPage({ qrCode }: { qrCode: string }) {
  const businessSlug = "tj-cafe-vientiane";

  return (
    <PublicShell businessSlug={businessSlug}>
      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-blue-600">QR Code</p>
          <h1 className="mt-1 text-3xl font-black">{qrCode}</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            This frontend route is ready to resolve a QR code to business, branch, and
            table context when backend integration starts.
          </p>
          <Link
            href={`/b/${businessSlug}/menu`}
            className="mt-5 inline-flex rounded-md bg-blue-600 px-5 py-3 text-sm font-black text-white"
          >
            Open linked menu
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}

function StoreInfoCard({ businessSlug }: { businessSlug: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">{businessName(businessSlug)}</h2>
      <div className="mt-5 space-y-4">
        <InfoRow icon={MapPin} title="Address" text="Rue Setthathirath, Vientiane" />
        <InfoRow icon={Clock} title="Open Hours" text="08:00 - 21:00 daily" />
        <InfoRow icon={Store} title="Branch" text="Main Branch" />
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-black">{title}</span>
        <span className="text-sm font-medium text-slate-600">{text}</span>
      </span>
    </div>
  );
}
