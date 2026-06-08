import { Link, useLocation } from "react-router-dom";
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
import { lo } from "../utils/lao-labels";

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
  businessSlug,
  footerText = "This is a digital menu. Please order with our staff."
}: {
  children: ReactNode;
  businessSlug?: string;
  footerText?: string;
}) {
  return (
    <main className="h-screen overflow-hidden bg-[#eef4ff] text-[#071633]">
      <div className="mx-auto flex h-screen w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-[0_24px_80px_rgba(15,52,112,0.12)] sm:border-x sm:border-blue-100">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 pb-4">
          {children}
          <div className="mt-auto pt-5">
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-center text-[11px] leading-5 font-bold text-blue-600">
            {lo(footerText)}
            </div>
          </div>
        </div>
        {businessSlug ? <MobileBottomNav businessSlug={businessSlug} /> : null}
      </div>
    </main>
  );
}

function BusinessHeader({ businessSlug }: { businessSlug: string }) {
  const action: ReactNode | undefined = undefined;

  return (
    <header className="flex items-center justify-between gap-3">
      <Link to={`/b/${businessSlug}`} className="flex min-w-0 items-center gap-3">
        <img
          src={business.logo}
          alt={business.name}
          className="h-[54px] w-[54px] shrink-0 rounded-full border border-blue-100 object-cover shadow-sm"
        />
        <span className="min-w-0">
          <span className="block truncate text-[18px] leading-6 font-black">
            {businessName(businessSlug)}
          </span>
          <span className="block truncate text-[11px] font-bold text-slate-500">
            {lo(business.tagline)}
          </span>
        </span>
      </Link>
      <div className="hidden">
        <Link
          to={`/b/${businessSlug}/menu`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 text-[12px] font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
        >
          <Grid2X2 className="h-4 w-4" />
          {lo("Menu")}
        </Link>
        <Link
          to={`/b/${businessSlug}/info`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] transition hover:border-blue-300 hover:bg-blue-50"
        >
          <Info className="h-4 w-4" />
          {lo("Info")}
        </Link>
        <a
          href={`tel:${business.phone.replace(/\s/g, "")}`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] transition hover:border-blue-300 hover:bg-blue-50"
        >
          <Phone className="h-4 w-4" />
          {lo("Call")}
        </a>
        {action ?? (
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-[12px] font-black text-[#071633] transition hover:border-blue-300 hover:bg-blue-50"
          >
            ລາວ
            <ChevronRight className="h-3.5 w-3.5 rotate-90" strokeWidth={2.4} />
          </button>
        )}
      </div>
    </header>
  );
}

function MobilePageBar({
  title,
  backTo,
  action
}: {
  title: string;
  backTo: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid h-10 grid-cols-[40px_minmax(0,1fr)_40px] items-center">
      <Link
        to={backTo}
        className="grid h-10 w-10 place-items-center rounded-full text-[#071633] transition hover:bg-blue-50"
        aria-label={lo("Back to store")}
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.6} />
      </Link>
      <h1 className="truncate text-center text-[14px] font-black">{lo(title)}</h1>
      {action ?? <span />}
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
      className={`${className} flex w-full items-center gap-2`}
    >
      {category && normalizeCategory(category) !== "all" ? (
        <input type="hidden" name="category" value={normalizeCategory(category)} />
      ) : null}
      <label className="relative block min-w-0 flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          name="search"
          defaultValue={value}
          placeholder={lo("Search menu...")}
          className="h-11 w-full rounded-xl border border-transparent bg-[#f5f7fb] pr-9 pl-10 text-[13px] font-bold text-[#071633] transition outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
        />
        {value ? (
          <Link
            to={cancelHref}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            aria-label={lo("Clear search")}
          >
            <XCircle className="h-4 w-4" />
          </Link>
        ) : null}
      </label>
      {cancel ? (
        <Link to={cancelHref} className="shrink-0 text-[11px] font-black text-blue-600">
          {lo("Cancel")}
        </Link>
      ) : (
        <button type="submit" className="sr-only">
          {lo("Search")}
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
    <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto pb-1">
      {categories.map(({ id, label, icon: Icon }) => (
        <Link
          key={id}
          to={menuHref(businessSlug, id)}
          className={`grid min-w-[64px] place-items-center rounded-xl border px-3 py-2 text-[10px] font-black transition hover:-translate-y-0.5 hover:shadow-md ${
            active === id
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-blue-100 bg-white text-[#071633]"
          }`}
        >
          <Icon className="mb-1 h-5 w-5" strokeWidth={2.35} />
          {lo(label)}
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
    <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto pb-1">
      {coffeeTabs.map((tab) => (
        <Link
          key={tab.id}
          to={menuHref(businessSlug, tab.id)}
          className={`inline-flex h-9 shrink-0 items-center justify-center rounded-full border px-3 text-[11px] font-black transition hover:-translate-y-0.5 hover:shadow-md ${
            active === tab.id
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-100 bg-white text-slate-600"
          }`}
        >
          {lo(tab.label)}
        </Link>
      ))}
    </div>
  );
}

function StoreContextCard() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <SmallInfoCard icon={Grid2X2} label="Table" value={business.table} />
      <SmallInfoCard icon={CalendarDays} label="Dine In" value="Today" />
      <SmallInfoCard
        icon={Clock}
        label="Open"
        value={business.openHours}
        tone="green"
      />
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
    <div className="min-w-0 rounded-full border border-blue-100 bg-white px-2.5 py-2 shadow-sm">
      <div className="flex min-w-0 items-center gap-1.5">
        <Icon
          className={`h-3.5 w-3.5 shrink-0 ${tone === "green" ? "text-emerald-500" : "text-blue-600"}`}
          strokeWidth={2.4}
        />
        <div className="min-w-0">
          <div className="truncate text-[8px] leading-3 font-bold text-slate-500">
            {lo(label)}
          </div>
          <div
            className={`truncate text-[9.5px] leading-3 font-black ${
              tone === "green" ? "text-emerald-600" : "text-[#071633]"
            }`}
          >
            {lo(value)}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative h-[150px] overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(13,91,255,0.14)]">
      <img
        src={business.heroImage}
        alt="Freshly brewed coffee"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      <div className="absolute top-6 left-4 max-w-[210px] text-white">
        <h1 className="text-[22px] leading-tight font-black">
          {lo("Freshly brewed for you")}
        </h1>
        <p className="mt-2 text-[11px] leading-4 font-bold">
          {lo("Quality ingredients, great taste.")}
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
      to={`/b/${businessSlug}/menu/${item.slug}`}
      className="grid grid-cols-[94px_minmax(0,1fr)] gap-3 rounded-2xl border border-blue-100 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
    >
      <div className="relative h-[86px] overflow-hidden rounded-xl bg-blue-50">
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover ${item.unavailable ? "grayscale" : ""}`}
        />
        {item.unavailable ? (
          <div className="absolute inset-0 grid place-items-center bg-white/65 text-[11px] font-black text-red-600">
            {lo("Out of Stock")}
          </div>
        ) : null}
      </div>
      <div className="min-w-0 py-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="truncate text-[13px] font-black">
            {lo(item.name)}
          </h2>
          {item.unavailable ? (
            <span className="shrink-0 rounded-md bg-red-50 px-2 py-1 text-[9px] font-black text-red-600">
              {lo("Out")}
            </span>
          ) : item.badge ? (
            <span className="shrink-0 rounded-md bg-orange-50 px-2 py-1 text-[9px] font-black text-orange-500">
              {lo(item.badge)}
            </span>
          ) : null}
        </div>
        <p
          className={`mt-1 text-[11px] leading-4 font-semibold text-slate-500 ${
            compact ? "line-clamp-2" : ""
          }`}
        >
          {lo(item.description)}
        </p>
        <p
          className={`mt-2 text-[12px] font-black ${
            item.unavailable ? "text-slate-400 line-through" : "text-blue-600"
          }`}
        >
          {item.price}
        </p>
      </div>
    </Link>
  );
}

function MobileBottomNav({ businessSlug }: { businessSlug: string }) {
  const { pathname } = useLocation();
  const isInfoActive = pathname.startsWith(`/b/${businessSlug}/info`);
  const isMenuActive =
    pathname === `/b/${businessSlug}` || pathname.startsWith(`/b/${businessSlug}/menu`);
  const baseClass =
    "flex h-12 items-center justify-center gap-2 rounded-xl text-[12px] font-black transition hover:bg-blue-50";
  const activeClass = "bg-blue-50 text-blue-600";
  const inactiveClass = "bg-white text-[#071633]";

  return (
    <nav className="shrink-0 border-t border-blue-100 bg-white px-4 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 gap-2">
      <Link
        to={`/b/${businessSlug}/menu`}
        className={`${baseClass} ${isMenuActive ? activeClass : inactiveClass}`}
      >
        <Grid2X2 className="h-4 w-4" />
        {lo("Menu")}
      </Link>
      <Link
        to={`/b/${businessSlug}/info`}
        className={`${baseClass} ${isInfoActive ? activeClass : inactiveClass}`}
      >
        <Info className="h-4 w-4" />
        {lo("Info")}
      </Link>
      <a
        href={`tel:${business.phone.replace(/\s/g, "")}`}
        className={`${baseClass} ${inactiveClass}`}
      >
        <Phone className="h-4 w-4" />
        {lo("Call Staff")}
      </a>
      </div>
    </nav>
  );
}

export function PublicBusinessLanding({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicMenuFrame businessSlug={businessSlug}>
      <BusinessHeader businessSlug={businessSlug} />
      <section className="mt-4 space-y-3">
        <StoreContextCard />
        <HeroCard />
        <MenuSearch businessSlug={businessSlug} />
      </section>
      <section className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[14px] font-black">{lo("Categories")}</h2>
          <Link
            to={`/b/${businessSlug}/menu`}
            className="text-[10px] font-black text-blue-600"
          >
            {lo("View all")}
          </Link>
        </div>
        <CategoryTabs businessSlug={businessSlug} />
      </section>
      <section className="mt-5">
        <h2 className="text-[14px] font-black">{lo("Popular Picks")}</h2>
        <div className="mt-3 grid gap-3">
          {menuItems.slice(0, 3).map((item) => (
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
    <PublicMenuFrame businessSlug={businessSlug}>
      <MobilePageBar
        title={menuCategoryTitle(activeCategory)}
        backTo={`/b/${businessSlug}`}
        action={
          <Link
            to={`/b/${businessSlug}/menu?search=latte`}
            className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-[#071633] transition hover:bg-blue-100"
            aria-label={lo("Search")}
          >
            <Search className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        }
      />
      {branchSlug ? (
        <p className="mt-2 text-center text-[11px] font-bold text-slate-500">
          {titleFromSlug(branchSlug)}
        </p>
      ) : null}
      <section className="mt-4">
        <CategoryTabs businessSlug={businessSlug} active={activeTopCategory} />
        {activeTopCategory === "coffee" ? (
          <CoffeeTabs businessSlug={businessSlug} active={coffeeActive} />
        ) : null}
      </section>
      <div className="mt-4 grid gap-3">
        {visibleItems.map((item) => (
          <MenuListItem
            key={item.slug}
            item={item}
            businessSlug={businessSlug}
            compact
          />
        ))}
        {visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-8 text-center">
            <p className="text-[14px] font-black text-[#071633]">{lo("No items available")}</p>
            <p className="mt-2 text-[12px] font-bold text-slate-500">
              {lo("Please choose another category.")}
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
    <PublicMenuFrame businessSlug={businessSlug}>
      <MobilePageBar
        title={item.name}
        backTo={`/b/${businessSlug}/menu`}
        action={
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-[#071633] transition hover:bg-blue-50"
            aria-label={lo("Share item")}
          >
            <Share2 className="h-4 w-4" strokeWidth={2.4} />
          </button>
        }
      />

      <section className="mt-4 space-y-4">
        <div className="relative h-[260px] overflow-hidden rounded-2xl bg-blue-50 shadow-[0_18px_50px_rgba(13,91,255,0.14)]">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          {item.badge ? (
            <span className="absolute top-4 right-4 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-black text-orange-500 shadow-sm">
              {lo(item.badge)}
            </span>
          ) : null}
        </div>

        <div>
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-600">
            {lo(item.category)}
          </span>
          <h1 className="mt-3 text-[24px] leading-tight font-black">
            {lo(item.name)}
          </h1>
          <p className="mt-2 text-[18px] font-black text-blue-600">{item.price}</p>
          <p className="mt-3 text-[12px] leading-5 font-semibold text-slate-600">
            {lo(item.description)} {lo("A perfect balance of bold and creamy.")}
          </p>

          <div className="mt-5 divide-y divide-blue-100 rounded-2xl border border-blue-100 bg-white">
            <DetailRow icon={Coffee} label="Category" value={item.category} />
            <DetailRow icon={CalendarDays} label="Size" value={item.size} />
            <DetailRow icon={Store} label="Ingredients" value={item.ingredients} />
            <DetailRow icon={Info} label="Allergens" value={item.allergens} />
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[11px] leading-5 font-bold text-blue-600">
            {lo("This is a digital menu item. Please place your order with our staff.")}
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
    <PublicMenuFrame businessSlug={businessSlug}>
      <MobilePageBar
        title="Out of Stock"
        backTo={`/b/${businessSlug}/menu`}
        action={
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-[#071633] transition hover:bg-blue-50"
            aria-label={lo("Share item")}
          >
            <Share2 className="h-4 w-4" strokeWidth={2.4} />
          </button>
        }
      />

      <section className="mt-4 space-y-4">
        <div className="relative h-[260px] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_18px_50px_rgba(239,68,68,0.10)]">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 grid place-items-center bg-white/62">
            <div className="grid place-items-center text-red-500">
              <XCircle className="h-12 w-12" strokeWidth={2.2} />
              <span className="mt-2 text-[18px] font-black">{lo("Out of Stock")}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[11px] font-black text-red-600">
            {lo("Temporarily unavailable")}
          </span>
          <h1 className="mt-3 text-[24px] leading-tight font-black">
            {lo(item.name)}
          </h1>
          <p className="mt-2 text-[18px] font-black text-slate-400 line-through">
            {item.price}
          </p>
          <p className="mt-3 text-[12px] leading-5 font-semibold text-slate-600">
            {lo(item.description)}
          </p>
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[11px] leading-5 font-bold text-red-600">
            {lo("Sorry, this item is currently out of stock. Please try another item.")}
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
      <span className="text-[12px] font-bold text-slate-500">{lo(label)}</span>
      <span className="text-right text-[12px] font-black break-words text-[#071633]">
        {lo(value)}
      </span>
    </div>
  );
}

export function PublicInfoPage({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicMenuFrame businessSlug={businessSlug} footerText="Thank you for visiting us!">
      <MobilePageBar title="Store Info" backTo={`/b/${businessSlug}`} />
      <section className="mt-4 space-y-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={business.logo}
              alt={business.name}
              className="h-[68px] w-[68px] rounded-full border border-blue-100 object-cover"
            />
            <div>
              <h1 className="text-[20px] leading-tight font-black">
                {businessName(businessSlug)}
              </h1>
              <p className="text-[11px] font-bold text-slate-500">{lo(business.tagline)}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <ContactRow
              icon={MapPin}
              text={`${lo(business.branch)}, ${lo(business.address)}`}
            />
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

        <div className="space-y-3">
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <h2 className="text-[15px] font-black">{lo("Opening Hours")}</h2>
            <div className="mt-4 space-y-3 text-[11px] font-bold">
              <div className="flex justify-between gap-4">
                <span>{lo("Monday - Friday")}</span>
                <span>6:30 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>{lo("Saturday - Sunday")}</span>
                <span>6:30 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <h2 className="text-[15px] font-black">{lo("About Us")}</h2>
            <p className="mt-2 text-[12px] leading-5 font-semibold text-slate-600">
              {lo("TJ Cafe Vientiane serves quality coffee, delicious drinks, and tasty food in a cozy and welcoming atmosphere.")}
            </p>
            <img
              src={business.storeImage}
              alt={business.name}
              className="mt-4 h-[150px] w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mt-3 grid gap-3">
        <InfoPanel
          icon={Wifi}
          title="Facilities"
          text="Free Wi-Fi, Power Outlets, Air Condition"
        />
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
    <span
      className={`grid h-9 w-9 place-items-center rounded-full text-white ${classes[tone]}`}
    >
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
          <span className="block text-[12px] font-black">{lo(title)}</span>
          <span className="block truncate text-[11px] font-semibold text-slate-500">
            {lo(text)}
          </span>
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </div>
  );
}

export function PublicBookingPage({ businessSlug }: { businessSlug: string }) {
  return (
    <PublicMenuFrame
      businessSlug={businessSlug}
      footerText="Please contact staff to confirm booking availability."
    >
      <MobilePageBar title="Booking Request" backTo={`/b/${businessSlug}`} />
      <div className="mt-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <CalendarDays className="h-12 w-12 text-blue-600" />
        <h1 className="mt-5 text-[24px] leading-tight font-black">
          {lo("Booking Request")}
        </h1>
        <p className="mt-3 text-[12px] leading-5 font-semibold text-slate-600">
          {lo("Booking can be enabled for supported businesses. This public menu stays view-only and does not create orders or payments.")}
        </p>
      </div>
    </PublicMenuFrame>
  );
}

export function PublicQrPage({ qrCode }: { qrCode: string }) {
  const businessSlug = "tj-cafe-vientiane";

  return (
    <PublicMenuFrame businessSlug={businessSlug}>
      <BusinessHeader businessSlug={businessSlug} />
      <div className="mt-5 rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm">
        <Grid2X2 className="mx-auto h-12 w-12 text-blue-600" />
        <p className="mt-4 text-[12px] font-black text-blue-600">QR Code</p>
        <h1 className="mt-2 text-[24px] font-black">{qrCode}</h1>
        <p className="mt-3 text-[12px] leading-5 font-semibold text-slate-600">
          {lo("This QR opens the linked public menu for table")} {business.table}.
        </p>
        <Link
          to={`/b/${businessSlug}/menu`}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-[13px] font-black text-white transition hover:bg-blue-700"
        >
          {lo("Open linked menu")}
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
    <PublicMenuFrame businessSlug={businessSlug}>
      <section>
        <MenuSearch
          businessSlug={businessSlug}
          value={query}
          cancel
          category={activeCategory}
          className="mt-0"
        />
        <p className="mt-3 text-[11px] font-bold text-slate-500">
          {results.length} {lo("results found")}
        </p>
      </section>
      <div className="mt-3 grid gap-3">
        {results.map((item) => (
          <MenuListItem
            key={item.slug}
            item={item}
            businessSlug={businessSlug}
            compact
          />
        ))}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-10 text-center">
            <Search className="mx-auto h-8 w-8 text-blue-500" />
            <p className="mt-3 text-[14px] font-black text-[#071633]">{lo("No menu found")}</p>
            <p className="mt-2 text-[12px] font-bold text-slate-500">
              {lo("Try another keyword or clear the search.")}
            </p>
          </div>
        ) : null}
      </div>
    </PublicMenuFrame>
  );
}
