import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  ChevronRight,
  Clock,
  Coffee,
  CupSoda,
  Grid2X2,
  Info,
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  Search,
  Share2,
  Store,
  Star,
  Utensils,
  Wifi,
  XCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PublicMenuItem = {
  slug: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  badge?: string;
  size: string;
  ingredients: string;
  allergens: string;
  unavailable?: boolean;
};

type PublicCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const business = {
  name: "TJ Cafe Vientiane",
  tagline: "Good Coffee, Good Day",
  logo: "/brand/tj-pos-mark.png",
  table: "T03",
  branch: "Lane Xang Avenue",
  address: "Vientiane Capital, Laos",
  phone: "020 5555 1234",
  email: "info@tjcafe.la",
  website: "www.tjcafe.la",
  openHours: "Closes 10:00 PM",
  heroImage:
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
  storeImage:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85"
};

const categories: PublicCategory[] = [
  { id: "all", label: "All", icon: Grid2X2 },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "signature", label: "Signature", icon: Star },
  { id: "tea", label: "Tea", icon: CupSoda },
  { id: "food", label: "Food", icon: Utensils }
];

const coffeeTabs = [
  { id: "coffee", label: "All Coffee" },
  { id: "hot", label: "Hot Coffee" },
  { id: "iced", label: "Iced Coffee" },
  { id: "frappe", label: "Frappe" }
];

const menuItems: PublicMenuItem[] = [
  {
    slug: "iced-latte",
    name: "Iced Latte",
    price: "LAK 26,000",
    description: "Smooth espresso with fresh milk over ice.",
    category: "Iced Coffee",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=420&q=85",
    badge: "Best Seller",
    size: "16 oz",
    ingredients: "Espresso, Fresh Milk, Ice",
    allergens: "Milk"
  },
  {
    slug: "americano",
    name: "Americano",
    price: "LAK 22,000",
    description: "Rich and bold espresso diluted with hot water.",
    category: "Hot Coffee",
    image:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=420&q=85",
    size: "12 oz",
    ingredients: "Espresso, Hot Water",
    allergens: "None"
  },
  {
    slug: "cappuccino",
    name: "Cappuccino",
    price: "LAK 25,000",
    description: "Espresso with steamed milk and milk foam.",
    category: "Hot Coffee",
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=420&q=85",
    size: "12 oz",
    ingredients: "Espresso, Steamed Milk, Foam",
    allergens: "Milk"
  },
  {
    slug: "caramel-macchiato",
    name: "Caramel Macchiato",
    price: "LAK 28,000",
    description: "Vanilla milk with espresso and caramel drizzle.",
    category: "Signature",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=420&q=85",
    size: "16 oz",
    ingredients: "Espresso, Milk, Vanilla, Caramel",
    allergens: "Milk"
  },
  {
    slug: "mocha",
    name: "Mocha",
    price: "LAK 28,000",
    description: "Chocolate and espresso with steamed milk.",
    category: "Signature",
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=420&q=85",
    size: "16 oz",
    ingredients: "Espresso, Cocoa, Milk",
    allergens: "Milk"
  },
  {
    slug: "matcha-latte",
    name: "Matcha Latte",
    price: "LAK 28,000",
    description: "Premium matcha with steamed milk.",
    category: "Tea",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=420&q=85",
    size: "16 oz",
    ingredients: "Matcha, Milk",
    allergens: "Milk"
  },
  {
    slug: "hot-latte",
    name: "Hot Latte",
    price: "LAK 24,000",
    description: "Espresso with steamed milk.",
    category: "Hot Coffee",
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=420&q=85",
    size: "12 oz",
    ingredients: "Espresso, Steamed Milk",
    allergens: "Milk"
  },
  {
    slug: "strawberry-frappe",
    name: "Strawberry Frappe",
    price: "LAK 30,000",
    description: "Blended strawberry with milk and ice, topped with whipped cream.",
    category: "Frappe",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=420&q=85",
    size: "16 oz",
    ingredients: "Strawberry, Milk, Ice, Whipped Cream",
    allergens: "Milk",
    unavailable: true
  },
  {
    slug: "butter-croissant",
    name: "Butter Croissant",
    price: "LAK 22,000",
    description: "Flaky butter croissant baked fresh for coffee pairing.",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=420&q=85",
    size: "1 piece",
    ingredients: "Flour, Butter, Milk, Egg",
    allergens: "Milk, Egg, Gluten"
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
  return titleFromSlug(businessSlug) || business.name;
}

function findItem(itemSlug: string) {
  return menuItems.find((item) => item.slug === itemSlug) ?? menuItems[0];
}

function normalizeCategory(category?: string) {
  const categoryIds = new Set([
    ...categories.map((item) => item.id),
    ...coffeeTabs.map((item) => item.id)
  ]);
  return category && categoryIds.has(category) ? category : "all";
}

function filterItemsByCategory(category?: string) {
  const normalized = normalizeCategory(category);

  if (normalized === "all") return menuItems;
  if (normalized === "coffee") {
    return menuItems.filter(
      (item) => item.category.includes("Coffee") || item.category === "Frappe"
    );
  }
  if (normalized === "hot") {
    return menuItems.filter((item) => item.category === "Hot Coffee");
  }
  if (normalized === "iced") {
    return menuItems.filter((item) => item.category === "Iced Coffee");
  }
  if (normalized === "frappe") {
    return menuItems.filter((item) => item.category === "Frappe");
  }
  if (normalized === "tea") {
    return menuItems.filter((item) => item.category === "Tea");
  }
  if (normalized === "signature") {
    return menuItems.filter((item) => item.category === "Signature");
  }
  if (normalized === "food") {
    return menuItems.filter((item) => item.category === "Food");
  }

  return menuItems;
}

function filterItemsBySearch(items: PublicMenuItem[], query?: string) {
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) return items;

  return items.filter((item) =>
    [item.name, item.description, item.category, item.ingredients]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

function menuCategoryTitle(category?: string) {
  const normalized = normalizeCategory(category);

  if (normalized === "all") return "All Menu";
  if (normalized === "hot") return "Hot Coffee";
  if (normalized === "iced") return "Iced Coffee";
  if (normalized === "frappe") return "Frappe";

  return categories.find((item) => item.id === normalized)?.label ?? "Menu";
}

function menuHref(businessSlug: string, category?: string) {
  const normalized = normalizeCategory(category);

  if (normalized === "all") return `/b/${businessSlug}/menu`;
  return `/b/${businessSlug}/menu?category=${normalized}`;
}

function PublicMenuFrame({
  children,
  footerText = "This is a digital menu. Please order with our staff."
}: {
  children: ReactNode;
  footerText?: string;
}) {
  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#071633]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex-1">{children}</div>
        <div className="mt-6 rounded-2xl border border-blue-100 bg-white px-4 py-3 text-center text-[12px] font-bold text-blue-600 shadow-sm sm:text-[13px]">
          {footerText}
        </div>
      </div>
    </main>
  );
}

function BusinessHeader({
  businessSlug,
  action
}: {
  businessSlug: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <Link href={`/b/${businessSlug}`} className="flex min-w-0 items-center gap-3">
        <img
          src={business.logo}
          alt={business.name}
          className="h-12 w-12 rounded-full border border-blue-100 object-cover sm:h-14 sm:w-14"
        />
        <span className="min-w-0">
          <span className="block truncate text-[18px] font-black sm:text-[22px]">
            {businessName(businessSlug)}
          </span>
          <span className="block text-[12px] font-bold text-slate-500 sm:text-[13px]">
            {business.tagline}
          </span>
        </span>
      </Link>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          href={`/b/${businessSlug}/menu`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 text-[12px] font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
        >
          <Grid2X2 className="h-4 w-4" />
          Menu
        </Link>
        <Link
          href={`/b/${businessSlug}/info`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] transition hover:border-blue-300 hover:bg-blue-50"
        >
          <Info className="h-4 w-4" />
          Info
        </Link>
        <a
          href={`tel:${business.phone.replace(/\s/g, "")}`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] transition hover:border-blue-300 hover:bg-blue-50"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        {action ?? (
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] transition hover:border-blue-300 hover:bg-blue-50"
          >
            EN
            <ChevronRight className="h-3.5 w-3.5 rotate-90" strokeWidth={2.4} />
          </button>
        )}
      </div>
    </header>
  );
}

function MenuSearch({
  businessSlug,
  value = "",
  cancel = false,
  category,
  className = "mt-4"
}: {
  businessSlug: string;
  value?: string;
  cancel?: boolean;
  category?: string;
  className?: string;
}) {
  const cancelHref = menuHref(businessSlug, category);

  return (
    <form
      action={`/b/${businessSlug}/menu`}
      className={`${className} flex w-full items-center gap-3`}
    >
      {category && normalizeCategory(category) !== "all" ? (
        <input type="hidden" name="category" value={normalizeCategory(category)} />
      ) : null}
      <label className="relative block min-w-0 flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          name="search"
          defaultValue={value}
          placeholder="Search menu..."
          className="h-12 w-full rounded-2xl border border-blue-100 bg-white pr-9 pl-10 text-[14px] font-bold text-[#071633] outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        />
        {value ? (
          <Link
            href={cancelHref}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            aria-label="Clear search"
          >
            <XCircle className="h-4 w-4" />
          </Link>
        ) : null}
      </label>
      {cancel ? (
        <Link href={cancelHref} className="text-[12px] font-black text-blue-600">
          Cancel
        </Link>
      ) : (
        <button type="submit" className="sr-only">
          Search
        </button>
      )}
    </form>
  );
}

function CategoryTabs({
  active = "all",
  businessSlug
}: {
  active?: string;
  businessSlug: string;
}) {
  return (
    <div className="mt-4 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      {categories.map(({ id, label, icon: Icon }) => (
        <Link
          key={id}
          href={menuHref(businessSlug, id)}
          className={`grid min-w-[72px] place-items-center rounded-2xl border px-4 py-3 text-[11px] font-black transition hover:-translate-y-0.5 hover:shadow-md sm:min-w-[104px] sm:text-[12px] ${
            active === id
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-blue-100 bg-white text-[#071633]"
          }`}
        >
          <Icon className="mb-1 h-5 w-5" strokeWidth={2.35} />
          {label}
        </Link>
      ))}
    </div>
  );
}

function CoffeeTabs({
  businessSlug,
  active = "all"
}: {
  businessSlug: string;
  active?: string;
}) {
  return (
    <div className="mt-4 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      {coffeeTabs.map((tab) => (
        <Link
          key={tab.id}
          href={menuHref(businessSlug, tab.id)}
          className={`inline-flex h-10 shrink-0 items-center justify-center rounded-full border px-4 text-[12px] font-black transition hover:-translate-y-0.5 hover:shadow-md sm:px-5 ${
            active === tab.id
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-100 bg-white text-slate-600"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

function StoreContextCard() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <SmallInfoCard icon={Grid2X2} label="Table" value={business.table} />
      <SmallInfoCard icon={CalendarDays} label="Dine In" value="Today" />
      <SmallInfoCard icon={Clock} label="Open" value={business.openHours} tone="green" />
    </div>
  );
}

function SmallInfoCard({
  icon: Icon,
  label,
  value,
  tone = "blue"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "blue" | "green";
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4">
      <Icon
        className={`h-4 w-4 ${tone === "green" ? "text-emerald-500" : "text-blue-600"}`}
        strokeWidth={2.35}
      />
      <div className="mt-2 text-[10px] font-bold text-slate-500 sm:text-[11px]">{label}</div>
      <div
        className={`truncate text-[11px] font-black sm:text-[13px] ${
          tone === "green" ? "text-emerald-600" : "text-[#071633]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative h-[220px] overflow-hidden rounded-[24px] shadow-[0_22px_70px_rgba(13,91,255,0.14)] sm:h-[300px] lg:h-[380px]">
      <img
        src={business.heroImage}
        alt="Freshly brewed coffee"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      <div className="absolute top-8 left-6 max-w-[280px] text-white sm:top-10 sm:left-8 sm:max-w-[440px]">
        <h1 className="text-[30px] font-black leading-tight sm:text-[48px]">
          Freshly brewed for you
        </h1>
        <p className="mt-3 text-[13px] font-bold leading-5 sm:text-[16px] sm:leading-7">
          Quality ingredients, great taste.
        </p>
      </div>
    </div>
  );
}

function MenuListItem({
  item,
  businessSlug,
  compact = false
}: {
  item: PublicMenuItem;
  businessSlug: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/b/${businessSlug}/menu/${item.slug}`}
      className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 rounded-2xl border border-blue-100 bg-white p-2.5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-4 sm:p-3"
    >
      <div className="relative h-[88px] overflow-hidden rounded-xl bg-blue-50 sm:h-[124px]">
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover ${item.unavailable ? "grayscale" : ""}`}
        />
        {item.unavailable ? (
          <div className="absolute inset-0 grid place-items-center bg-white/65 text-[11px] font-black text-red-600">
            Out of Stock
          </div>
        ) : null}
      </div>
      <div className="min-w-0 py-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="truncate text-[14px] font-black sm:text-[16px]">{item.name}</h2>
          {item.unavailable ? (
            <span className="shrink-0 rounded-md bg-red-50 px-2 py-1 text-[9px] font-black text-red-600">
              Out
            </span>
          ) : item.badge ? (
            <span className="shrink-0 rounded-md bg-orange-50 px-2 py-1 text-[9px] font-black text-orange-500">
              {item.badge}
            </span>
          ) : null}
        </div>
        <p
          className={`mt-1 text-[12px] font-semibold leading-5 text-slate-500 sm:text-[13px] ${
            compact ? "line-clamp-2" : ""
          }`}
        >
          {item.description}
        </p>
        <p
          className={`mt-2 text-[13px] font-black sm:text-[15px] ${
            item.unavailable ? "text-slate-400 line-through" : "text-blue-600"
          }`}
        >
          {item.price}
        </p>
      </div>
    </Link>
  );
}

function BottomActions({ businessSlug }: { businessSlug: string }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <Link
        href={`/b/${businessSlug}/menu`}
        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-50 text-[12px] font-black text-blue-600"
      >
        <Grid2X2 className="h-4 w-4" />
        Photos
      </Link>
      <Link
        href={`/b/${businessSlug}/info`}
        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-[12px] font-black text-[#071633]"
      >
        <Info className="h-4 w-4" />
        Info
      </Link>
      <a
        href={`tel:${business.phone.replace(/\s/g, "")}`}
        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-[12px] font-black text-[#071633]"
      >
        <Phone className="h-4 w-4" />
        Call Staff
      </a>
    </div>
  );
}

export function PublicBusinessLanding({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicMenuFrame>
      <BusinessHeader businessSlug={businessSlug} />
      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="min-w-0">
          <HeroCard />
          <MenuSearch businessSlug={businessSlug} />
        </div>
        <aside className="space-y-4">
          <StoreContextCard />
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <p className="text-[12px] font-black text-blue-600">Store Info</p>
            <h2 className="mt-2 text-[22px] font-black">{businessName(businessSlug)}</h2>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-slate-600">
              {business.branch}, {business.address}
            </p>
            <BottomActions businessSlug={businessSlug} />
          </div>
        </aside>
      </section>
      <section className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[18px] font-black sm:text-[22px]">Categories</h2>
          <Link
            href={`/b/${businessSlug}/menu`}
            className="text-[12px] font-black text-blue-600 sm:text-[13px]"
          >
            View all
          </Link>
        </div>
        <CategoryTabs businessSlug={businessSlug} />
      </section>
      <section className="mt-6">
        <h2 className="text-[18px] font-black sm:text-[22px]">Popular Picks</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {menuItems.slice(0, 6).map((item) => (
            <MenuListItem
              key={item.slug}
              item={item}
              businessSlug={businessSlug}
              compact
            />
          ))}
        </div>
      </section>
    </PublicMenuFrame>
  );
}

export function PublicMenuPage({
  businessSlug,
  branchSlug,
  category
}: {
  businessSlug: string;
  branchSlug?: string;
  category?: string;
}) {
  const activeCategory = normalizeCategory(category ?? "coffee");
  const coffeeActive = coffeeTabs.some((tab) => tab.id === activeCategory)
    ? activeCategory
    : "coffee";
  const activeTopCategory =
    activeCategory === "hot" || activeCategory === "iced" || activeCategory === "frappe"
      ? "coffee"
      : activeCategory;
  const visibleItems = filterItemsByCategory(activeCategory);

  return (
    <PublicMenuFrame>
      <BusinessHeader businessSlug={businessSlug} />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href={`/b/${businessSlug}`}
            className="inline-flex items-center gap-2 text-[13px] font-black text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <h1 className="mt-3 text-[28px] font-black leading-tight sm:text-[40px]">
            {menuCategoryTitle(activeCategory)}
          </h1>
          {branchSlug ? (
            <p className="mt-1 text-[13px] font-bold text-slate-500">
              {titleFromSlug(branchSlug)}
            </p>
          ) : (
            <p className="mt-2 text-[14px] font-semibold text-slate-600">
              Browse menu items, prices, availability and store details.
            </p>
          )}
        </div>
      </div>
      <section className="mt-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
        <MenuSearch
          businessSlug={businessSlug}
          category={activeCategory}
          className="mt-0"
        />
        <CategoryTabs businessSlug={businessSlug} active={activeTopCategory} />
        {activeTopCategory === "coffee" ? (
          <CoffeeTabs businessSlug={businessSlug} active={coffeeActive} />
        ) : null}
      </section>
      <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => (
          <MenuListItem
            key={item.slug}
            item={item}
            businessSlug={businessSlug}
            compact
          />
        ))}
        {visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-8 text-center lg:col-span-2 xl:col-span-3">
            <p className="text-[14px] font-black text-[#071633]">No items available</p>
            <p className="mt-2 text-[12px] font-bold text-slate-500">
              Please choose another category.
            </p>
          </div>
        ) : null}
      </div>
    </PublicMenuFrame>
  );
}

export function PublicMenuItemPage({
  businessSlug,
  itemSlug
}: {
  businessSlug: string;
  itemSlug: string;
}) {
  const item = findItem(itemSlug);

  if (item.unavailable) {
    return <PublicUnavailableItemPage businessSlug={businessSlug} item={item} />;
  }

  return (
    <PublicMenuFrame>
      <BusinessHeader businessSlug={businessSlug} />
      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          href={`/b/${businessSlug}/menu`}
          className="inline-flex items-center gap-2 text-[13px] font-black text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to menu
        </Link>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
          aria-label="Share item"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:items-start">
        <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-blue-50 shadow-[0_22px_70px_rgba(13,91,255,0.14)] sm:h-[420px] lg:h-[560px]">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          {item.badge ? (
            <span className="absolute top-4 right-4 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-black text-orange-500 shadow-sm">
              {item.badge}
            </span>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-600">
            {item.category}
          </span>
          <h1 className="mt-4 text-[34px] font-black leading-tight sm:text-[44px]">
            {item.name}
          </h1>
          <p className="mt-3 text-[24px] font-black text-blue-600">{item.price}</p>
          <p className="mt-4 text-[14px] font-semibold leading-7 text-slate-600 sm:text-[15px]">
            {item.description} A perfect balance of bold and creamy.
          </p>

          <div className="mt-6 divide-y divide-blue-100 rounded-2xl border border-blue-100 bg-white">
            <DetailRow icon={Coffee} label="Category" value={item.category} />
            <DetailRow icon={CalendarDays} label="Size" value={item.size} />
            <DetailRow icon={Store} label="Ingredients" value={item.ingredients} />
            <DetailRow icon={Info} label="Allergens" value={item.allergens} />
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-[13px] font-bold leading-6 text-blue-600">
            This is a digital menu item. Please place your order with our staff.
          </div>
        </div>
      </section>
    </PublicMenuFrame>
  );
}

function PublicUnavailableItemPage({
  businessSlug,
  item
}: {
  businessSlug: string;
  item: PublicMenuItem;
}) {
  return (
    <PublicMenuFrame>
      <BusinessHeader businessSlug={businessSlug} />
      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          href={`/b/${businessSlug}/menu`}
          className="inline-flex items-center gap-2 text-[13px] font-black text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to menu
        </Link>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
          aria-label="Share item"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:items-start">
        <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_22px_70px_rgba(239,68,68,0.10)] sm:h-[420px] lg:h-[560px]">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 grid place-items-center bg-white/62">
            <div className="grid place-items-center text-red-500">
              <XCircle className="h-12 w-12" strokeWidth={2.2} />
              <span className="mt-2 text-[18px] font-black">Out of Stock</span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-red-100 bg-white p-5 shadow-sm sm:p-6">
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[11px] font-black text-red-600">
            Temporarily unavailable
          </span>
          <h1 className="mt-4 text-[34px] font-black leading-tight sm:text-[44px]">
            {item.name}
          </h1>
          <p className="mt-3 text-[24px] font-black text-slate-400 line-through">
            {item.price}
          </p>
          <p className="mt-4 text-[14px] font-semibold leading-7 text-slate-600 sm:text-[15px]">
            {item.description}
          </p>
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-4 text-[13px] font-bold leading-6 text-red-600">
            Sorry, this item is currently out of stock. Please try another item.
          </div>
        </div>
      </section>
    </PublicMenuFrame>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[28px_minmax(80px,120px)_minmax(0,1fr)] items-center gap-2 px-4 py-3">
      <Icon className="h-4 w-4 text-slate-500" />
      <span className="text-[12px] font-bold text-slate-500">{label}</span>
      <span className="break-words text-right text-[12px] font-black text-[#071633]">
        {value}
      </span>
    </div>
  );
}

export function PublicInfoPage({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicMenuFrame footerText="Thank you for visiting us!">
      <BusinessHeader businessSlug={businessSlug} />
      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/b/${businessSlug}`}
          className="inline-flex items-center gap-2 text-[13px] font-black text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>
      </div>
      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <img
              src={business.logo}
              alt={business.name}
              className="h-[68px] w-[68px] rounded-full border border-blue-100 object-cover"
            />
            <div>
              <h1 className="text-[28px] font-black leading-tight sm:text-[36px]">
                {businessName(businessSlug)}
              </h1>
              <p className="text-[13px] font-bold text-slate-500">{business.tagline}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <ContactRow icon={MapPin} text={`${business.branch}, ${business.address}`} />
            <ContactRow icon={Phone} text={business.phone} />
            <ContactRow icon={Mail} text={business.email} />
            <ContactRow icon={Store} text={business.website} />
          </div>
          <div className="mt-5 flex gap-3">
            <SocialDot icon={MessageCircle} tone="blue" />
            <SocialDot icon={Camera} tone="pink" />
            <SocialDot icon={Phone} tone="green" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-[20px] font-black">Opening Hours</h2>
            <div className="mt-4 space-y-3 text-[13px] font-bold">
              <div className="flex justify-between gap-4">
                <span>Monday - Friday</span>
                <span>6:30 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Saturday - Sunday</span>
                <span>6:30 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-[20px] font-black">About Us</h2>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-slate-600">
              TJ Cafe Vientiane serves quality coffee, delicious drinks, and tasty
              food in a cozy and welcoming atmosphere.
            </p>
            <img
              src={business.storeImage}
              alt={business.name}
              className="mt-4 h-[220px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoPanel icon={Wifi} title="Facilities" text="Free Wi-Fi, Power Outlets, Air Condition" />
        <InfoPanel icon={Store} title="Payment" text="Cash, Card, LAK QR" />
        <InfoPanel icon={Info} title="Note" text="Prices are inclusive of VAT." />
      </section>
    </PublicMenuFrame>
  );
}

function ContactRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[12px] font-bold text-[#071633]">
      <Icon className="h-4 w-4 text-slate-500" />
      {text}
    </div>
  );
}

function SocialDot({
  icon: Icon,
  tone
}: {
  icon: LucideIcon;
  tone: "blue" | "pink" | "green";
}) {
  const classes = {
    blue: "bg-blue-600",
    pink: "bg-pink-500",
    green: "bg-emerald-500"
  };

  return (
    <span className={`grid h-9 w-9 place-items-center rounded-full text-white ${classes[tone]}`}>
      <Icon className="h-4 w-4" />
    </span>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex h-full items-center justify-between rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-blue-600" />
        <span className="min-w-0">
          <span className="block text-[12px] font-black">{title}</span>
          <span className="block truncate text-[11px] font-semibold text-slate-500">
            {text}
          </span>
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </div>
  );
}

export function PublicBookingPage({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicMenuFrame footerText="Please contact staff to confirm booking availability.">
      <BusinessHeader businessSlug={businessSlug} />
      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/b/${businessSlug}`}
          className="inline-flex items-center gap-2 text-[13px] font-black text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>
      </div>
      <div className="mt-5 rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm sm:p-8 lg:max-w-3xl">
        <CalendarDays className="h-12 w-12 text-blue-600" />
        <h1 className="mt-5 text-[34px] font-black leading-tight sm:text-[44px]">
          Booking Request
        </h1>
        <p className="mt-4 text-[14px] font-semibold leading-7 text-slate-600 sm:text-[15px]">
          Booking can be enabled for supported businesses. This public menu stays
          view-only and does not create orders or payments.
        </p>
      </div>
    </PublicMenuFrame>
  );
}

export function PublicQrPage({ qrCode }: { qrCode: string }) {
  const businessSlug = "tj-cafe-vientiane";

  return (
    <PublicMenuFrame>
      <BusinessHeader businessSlug={businessSlug} />
      <div className="mt-6 rounded-[28px] border border-blue-100 bg-white p-6 text-center shadow-sm sm:p-8 lg:mx-auto lg:max-w-2xl">
        <Grid2X2 className="mx-auto h-12 w-12 text-blue-600" />
        <p className="mt-4 text-[12px] font-black text-blue-600">QR Code</p>
        <h1 className="mt-2 text-[34px] font-black sm:text-[44px]">{qrCode}</h1>
        <p className="mt-4 text-[14px] font-semibold leading-7 text-slate-600">
          This QR opens the linked public menu for table {business.table}.
        </p>
        <Link
          href={`/b/${businessSlug}/menu`}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-[13px] font-black text-white transition hover:bg-blue-700"
        >
          Open linked menu
        </Link>
      </div>
    </PublicMenuFrame>
  );
}

export function PublicSearchResultsPage({
  businessSlug,
  query = "latte",
  category
}: {
  businessSlug: string;
  query?: string;
  category?: string;
}) {
  const activeCategory = normalizeCategory(category);
  const results = filterItemsBySearch(filterItemsByCategory(activeCategory), query);

  return (
    <PublicMenuFrame>
      <BusinessHeader businessSlug={businessSlug} />
      <section className="mt-6 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
        <MenuSearch
          businessSlug={businessSlug}
          value={query}
          cancel
          category={activeCategory}
          className="mt-0"
        />
        <p className="mt-4 text-[13px] font-bold text-slate-500">
          {results.length} results found
        </p>
      </section>
      <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {results.map((item) => (
          <MenuListItem
            key={item.slug}
            item={item}
            businessSlug={businessSlug}
            compact
          />
        ))}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-10 text-center lg:col-span-2 xl:col-span-3">
            <Search className="mx-auto h-8 w-8 text-blue-500" />
            <p className="mt-3 text-[14px] font-black text-[#071633]">No menu found</p>
            <p className="mt-2 text-[12px] font-bold text-slate-500">
              Try another keyword or clear the search.
            </p>
          </div>
        ) : null}
      </div>
    </PublicMenuFrame>
  );
}
