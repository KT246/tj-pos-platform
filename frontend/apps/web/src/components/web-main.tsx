import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  Coffee,
  CreditCard,
  Gift,
  Globe,
  Headphones,
  Hotel,
  Info,
  LayoutDashboard,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  TabletSmartphone,
  TrendingUp,
  User,
  Users,
  Utensils,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ActiveNav =
  | "Home"
  | "POS Types"
  | "Features"
  | "Pricing"
  | "Add-ons"
  | "FAQ/Help"
  | "Contact";

type PageShellProps = {
  active: ActiveNav;
  children: ReactNode;
};

type IconCard = {
  title: string;
  description: string;
  Icon: LucideIcon;
  tone: string;
};

type TrustPill = readonly [string, string, LucideIcon];

const navItems: { label: ActiveNav; href: string; hasMenu?: boolean }[] = [
  { label: "Home", href: "/" },
  { label: "POS Types", href: "/pos-types", hasMenu: true },
  { label: "Features", href: "/features", hasMenu: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Add-ons", href: "/add-ons" },
  { label: "FAQ/Help", href: "/faq-help" },
  { label: "Contact", href: "/contact" }
];

const posTypes = [
  {
    title: "Retail POS",
    shortTitle: "Retail",
    description:
      "Perfect for shops and stores of all sizes, from single outlet to multi-branch operations.",
    bullets: [
      "Barcode and SKU management",
      "Low-stock inventory alerts",
      "Sales, returns and promotions",
      "Multi-store and warehouse support"
    ],
    Icon: ShoppingBag,
    tone: "blue",
    visual:
      "linear-gradient(135deg,#152a52 0%,#3f6fc7 38%,#f3a854 39%,#173a76 64%,#d7ebff 100%)"
  },
  {
    title: "Cafe POS",
    shortTitle: "Cafe",
    description:
      "Designed for cafes and coffee shops with quick service, modifiers and counter sales.",
    bullets: [
      "Quick order and billing",
      "Table and takeaway management",
      "Menu modifiers",
      "Daily sales and shift reports"
    ],
    Icon: Coffee,
    tone: "teal",
    visual:
      "radial-gradient(circle at 50% 48%,#f8ead4 0 18%,#9b663a 19% 34%,#d9b083 35% 50%,#f7f0e7 51% 100%)"
  },
  {
    title: "Restaurant POS",
    shortTitle: "Restaurant",
    description:
      "Built for dine-in, takeaway and delivery restaurants with table and kitchen flow.",
    bullets: [
      "Table management and floor plan",
      "Kitchen display support",
      "Combo and menu management",
      "Service charge and tax rules"
    ],
    Icon: Utensils,
    tone: "orange",
    visual:
      "radial-gradient(circle at 38% 55%,#f8c17a 0 16%,#8a331f 17% 30%,transparent 31%),radial-gradient(circle at 68% 48%,#ffe4b5 0 16%,#b15b2a 17% 30%,transparent 31%),linear-gradient(135deg,#f7efe6,#d97935)"
  },
  {
    title: "Beauty POS",
    shortTitle: "Beauty",
    description:
      "Ideal for salons, spas and beauty clinics managing appointments, staff and services.",
    bullets: [
      "Appointment scheduling",
      "Service and package management",
      "Staff commission tracking",
      "Product sales and inventory"
    ],
    Icon: Sparkles,
    tone: "pink",
    visual:
      "radial-gradient(circle at 65% 45%,#fff7fb 0 18%,#e8b6c8 19% 42%,transparent 43%),linear-gradient(135deg,#fff1f7,#d7c0ff)"
  },
  {
    title: "Hospitality POS",
    shortTitle: "Hospitality",
    description:
      "Tailored for hotels, guesthouses and hospitality businesses with front desk needs.",
    bullets: [
      "Room and reservation management",
      "Folio and billing",
      "Housekeeping and minibar",
      "Guest history and reporting"
    ],
    Icon: Hotel,
    tone: "blue",
    visual: "linear-gradient(135deg,#f8efe0 0%,#b48754 45%,#264a78 46%,#f6fbff 100%)"
  }
];

const coreFeatures: IconCard[] = [
  {
    title: "Sales & Billing",
    description: "Fast billing, multiple payment methods and receipts.",
    Icon: BriefcaseBusiness,
    tone: "blue"
  },
  {
    title: "Inventory Control",
    description: "Real-time stock tracking, batches and low-stock alerts.",
    Icon: PackageCheck,
    tone: "teal"
  },
  {
    title: "Customer Management",
    description: "Build customer profiles, loyalty and order history.",
    Icon: Users,
    tone: "purple"
  },
  {
    title: "Staff Management",
    description: "Manage staff, roles, permissions and activity tracking.",
    Icon: User,
    tone: "orange"
  },
  {
    title: "Reports & Analytics",
    description: "Insightful reports to track business performance anytime.",
    Icon: TrendingUp,
    tone: "green"
  },
  {
    title: "Multi-branch Management",
    description: "Centralized control for multiple locations.",
    Icon: Store,
    tone: "blue"
  },
  {
    title: "Branding & Receipts",
    description: "Custom receipts, logos, tax settings and invoice branding.",
    Icon: ReceiptText,
    tone: "cyan"
  },
  {
    title: "Payment Methods",
    description: "Cash, card, QR and digital wallet setup.",
    Icon: WalletCards,
    tone: "blue"
  }
];

const addOns = [
  {
    title: "Customer Display",
    description: "Show orders and promotions to customers in real-time.",
    price: "K 20,000",
    Icon: TabletSmartphone,
    tone: "blue"
  },
  {
    title: "Kitchen Display (KDS)",
    description: "Improve kitchen efficiency and order accuracy.",
    price: "K 50,000",
    Icon: LayoutDashboard,
    tone: "blue"
  },
  {
    title: "Staff Order Mobile",
    description: "Take orders on the go with mobile app.",
    price: "K 30,000",
    Icon: TabletSmartphone,
    tone: "teal"
  },
  {
    title: "QR Public Menu",
    description: "Digital menu for dine-in or takeaway.",
    price: "K 15,000",
    Icon: ShoppingCart,
    tone: "orange"
  },
  {
    title: "Loyalty Program",
    description: "Reward customers and boost retention.",
    price: "K 20,000",
    Icon: Gift,
    tone: "orange"
  },
  {
    title: "Advanced Reports",
    description: "Deeper insights for better business decisions.",
    price: "K 40,000",
    Icon: BarChart3,
    tone: "purple"
  },
  {
    title: "Receipt Customization",
    description: "Add your logo and create receipts your way.",
    price: "K 15,000",
    Icon: ReceiptText,
    tone: "blue"
  },
  {
    title: "Bank Transfer Support",
    description: "Accept payments by bank transfer with ease.",
    price: "K 15,000",
    Icon: Building2,
    tone: "teal"
  },
  {
    title: "Multi-branch Expansion",
    description: "Centralized control for multiple locations.",
    price: "K 80,000",
    Icon: Building2,
    tone: "blue"
  },
  {
    title: "Inventory Plus",
    description: "Advanced inventory tracking with batch and expiry.",
    price: "K 30,000",
    Icon: PackageCheck,
    tone: "green"
  },
  {
    title: "Reservation Module",
    description: "Manage table and room reservations easily.",
    price: "K 25,000",
    Icon: BriefcaseBusiness,
    tone: "purple"
  },
  {
    title: "Appointment Booking",
    description: "Let customers book appointments online.",
    price: "K 25,000",
    Icon: User,
    tone: "purple"
  }
];

const pricingPlans = [
  {
    name: "Starter",
    subtitle: "Perfect for small businesses just getting started.",
    price: "K 120,000",
    Icon: Rocket,
    features: [
      "1 Branch",
      "1 POS Device",
      "Up to 5 Staff",
      "Up to 2,000 Items",
      "Up to 5,000 Orders / month"
    ],
    cta: "Get Started",
    featured: false
  },
  {
    name: "Pro",
    subtitle: "Great for growing businesses that need more power.",
    price: "K 250,000",
    Icon: TrendingUp,
    features: [
      "Up to 3 Branches",
      "Up to 3 POS Devices",
      "Up to 15 Staff",
      "Up to 10,000 Items",
      "Up to 30,000 Orders / month"
    ],
    cta: "Request Demo",
    featured: true
  },
  {
    name: "Business",
    subtitle: "Advanced features for high-volume operations.",
    price: "K 500,000",
    Icon: BriefcaseBusiness,
    features: [
      "Up to 10 Branches",
      "Up to 10 POS Devices",
      "Up to 50 Staff",
      "Up to 50,000 Items",
      "Up to 100,000 Orders / month"
    ],
    cta: "Request Demo",
    featured: false
  },
  {
    name: "Enterprise",
    subtitle: "Unlimited scale with dedicated support and customization.",
    price: "Custom",
    Icon: ShieldCheck,
    features: [
      "Unlimited Branches",
      "Unlimited POS Devices",
      "Unlimited Staff",
      "Unlimited Items",
      "Unlimited Orders / month"
    ],
    cta: "Contact Sales",
    featured: false
  }
];

const faqGroups = [
  {
    title: "Getting Started",
    Icon: Rocket,
    tone: "blue",
    questions: [
      "How do I create a TJ POS account?",
      "How do I set up my business and location?",
      "Can I try TJ POS before subscribing?"
    ]
  },
  {
    title: "Pricing",
    Icon: Gift,
    tone: "green",
    questions: [
      "What plans and pricing do you offer?",
      "Is there a setup fee or hidden charge?",
      "Can I upgrade or downgrade my plan?"
    ]
  },
  {
    title: "Core Features",
    Icon: ShoppingCart,
    tone: "orange",
    questions: [
      "How do I add products and manage inventory?",
      "How do sales and invoicing work?",
      "Can I generate reports and export data?"
    ]
  },
  {
    title: "Add-ons",
    Icon: Sparkles,
    tone: "purple",
    questions: [
      "What add-ons are available?",
      "How do add-ons work and are they optional?",
      "Can I add or remove modules anytime?"
    ]
  },
  {
    title: "Billing & Payments",
    Icon: CreditCard,
    tone: "teal",
    questions: [
      "What payment methods do you accept?",
      "How does billing and renewal work?",
      "Can I change or cancel my subscription?"
    ]
  },
  {
    title: "Technical Support",
    Icon: Headphones,
    tone: "purple",
    questions: [
      "How can I contact support?",
      "What should I do if I face an issue?",
      "Is there training or documentation available?"
    ]
  }
];

function iconToneClass(tone: string) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    purple: "bg-violet-50 text-violet-600 ring-violet-100",
    pink: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100",
    cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100"
  };

  return tones[tone] ?? tones.blue;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="TJ POS Home">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-black text-white italic shadow-sm">
        TJ
      </span>
      <span className="leading-none">
        <span className="block text-xl font-black tracking-normal text-blue-600">
          TJ <span className="text-slate-950">POS</span>
        </span>
        <span className="block text-[9px] font-semibold text-slate-500">
          Smart POS for Every Business
        </span>
      </span>
    </Link>
  );
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font800 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
  icon
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font800 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-300 bg-white px-5 text-sm text-blue-600 transition hover:bg-blue-50"
    >
      {children}
      {icon}
    </Link>
  );
}

function SiteHeader({ active }: { active: ActiveNav }) {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between px-6 lg:px-8">
        <Logo />
        <nav className="hidden h-full items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font800 relative flex h-full items-center gap-1 px-4 text-sm transition ${
                active === item.label
                  ? "text-blue-600"
                  : "text-slate-900 hover:text-blue-600"
              }`}
            >
              {item.label}
              {item.hasMenu ? <ChevronDown className="h-3.5 w-3.5" /> : null}
              {active === item.label ? (
                <span className="absolute inset-x-4 bottom-0 h-1 rounded-t bg-blue-600" />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="font800 hidden h-9 items-center gap-2 rounded-md px-3 text-sm text-slate-900 md:flex">
            <Globe className="h-4 w-4" />
            EN
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/login"
            className="font800 hidden h-9 items-center gap-2 rounded-md border border-blue-300 bg-white px-5 text-sm text-blue-600 md:flex"
          >
            <User className="h-4 w-4" />
            Login
          </Link>
          <Link
            href="/request-demo"
            className="font800 inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm text-white shadow-sm"
          >
            Request Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  const columns = [
    ["Product", "POS Types", "Features", "Pricing", "Add-ons"],
    ["Company", "About Us", "Contact", "Careers", "Blog"],
    ["Support", "FAQ/Help", "User Guide", "System Status", "Request Support"]
  ];

  return (
    <footer className="border-t border-blue-100 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 py-6 lg:px-8">
        <div className="grid gap-7 md:grid-cols-[1.35fr_2fr_1.25fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
              TJ POS is a modern, cloud-based point-of-sale platform designed for
              businesses in Laos.
            </p>
            <div className="mt-4 flex gap-2">
              {["f", "m", "l", "y"].map((label, index) => (
                <span
                  key={label}
                  className={`font900 flex h-8 w-8 items-center justify-center rounded-md text-xs text-white ${
                    ["bg-blue-600", "bg-sky-500", "bg-green-500", "bg-red-500"][index]
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {columns.map(([title, ...links]) => (
              <div key={title}>
                <h3 className="font900 text-sm text-slate-950">{title}</h3>
                <div className="mt-3 space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      className="font700 block text-sm text-slate-600 hover:text-blue-600"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font900 text-sm text-slate-950">Contact Us</h3>
            <div className="font700 mt-3 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-700" /> +856 20 55 888 999
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-700" /> info@tjpos.la
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-700" />
                Unit 45, Saysettha District, Vientiane Capital, Laos
              </p>
            </div>
          </div>
          <div>
            <h3 className="font900 text-sm text-slate-950">Secure & Certified</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {["ISO 27001", "PCI DSS"].map((cert) => (
                <div
                  key={cert}
                  className="rounded-lg border border-blue-100 bg-white p-4"
                >
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <p className="font900 mt-2 text-xs text-slate-900">{cert}</p>
                  <p className="mt-1 text-[10px] text-slate-500">Compliant</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-blue-100 pt-4 text-xs text-slate-500 md:flex-row">
          <p>(c) 2025 TJ POS Co., Ltd. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageShell({ active, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SiteHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function Badge({
  children,
  Icon = Sparkles
}: {
  children: ReactNode;
  Icon?: LucideIcon;
}) {
  return (
    <span className="font900 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-600">
      <Icon className="h-4 w-4" />
      {children}
    </span>
  );
}

function HeroShell({
  badge,
  title,
  accent,
  description,
  primaryHref = "/request-demo",
  primaryLabel = "Request Demo",
  secondaryHref,
  secondaryLabel,
  secondaryIcon,
  showTrust = false,
  trustItems,
  hideActions = false,
  children
}: {
  badge: string;
  title: string;
  accent: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryIcon?: ReactNode;
  showTrust?: boolean;
  trustItems?: readonly TrustPill[];
  hideActions?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-6 py-7 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:px-8">
        <div className="flex flex-col justify-center">
          <Badge>{badge}</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl leading-tight font-black tracking-normal text-slate-950 lg:text-5xl">
            {title} <span className="text-blue-600">{accent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            {description}
          </p>
          {!hideActions ? (
            <div className="mt-7 flex flex-wrap gap-4">
              <PrimaryButton href={primaryHref}>{primaryLabel}</PrimaryButton>
              {secondaryHref && secondaryLabel ? (
                <SecondaryButton href={secondaryHref} icon={secondaryIcon}>
                  {secondaryLabel}
                </SecondaryButton>
              ) : null}
            </div>
          ) : null}
          {showTrust ? <TrustPills items={trustItems} /> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function TrustPills({ items = defaultTrustItems }: { items?: readonly TrustPill[] }) {
  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([title, body, Icon]) => (
        <div key={title} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
            <Icon className="h-4 w-4" />
          </span>
          <span>
            <span className="font900 block text-xs text-slate-900">{title}</span>
            <span className="font700 block text-xs text-slate-500">{body}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const defaultTrustItems: readonly TrustPill[] = [
  ["No Installation", "100% Cloud-based", Rocket],
  ["Works Offline", "Keep selling always", TabletSmartphone],
  ["Local Support", "Here in Laos", MapPin],
  ["Secure & Reliable", "Enterprise-grade security", ShieldCheck]
] as const;

const demoTrustItems: readonly TrustPill[] = [
  ["Tailored to Your Business", "Personal walkthrough", BriefcaseBusiness],
  ["No Obligation", "100% free", Check],
  ["Expert-Led", "Live demo", Headphones],
  ["Secure & Private", "Your data is safe", ShieldCheck]
] as const;

function DashboardMockup({ compact = false }: { compact?: boolean }) {
  const metrics = [
    ["Total Sales", "K 45,680,000", "+16.4%"],
    ["Transactions", "1,256", "+12.4%"],
    ["Average Order Value", "K 36,340", "+8.7%"],
    ["Gross Profit", "K 16,890,000", "+21.3%"]
  ];

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-[0_20px_70px_rgba(37,99,235,0.10)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <Logo />
        <div className="hidden items-center gap-3 md:flex">
          <button className="font800 h-8 rounded-md border border-slate-200 px-3 text-xs text-slate-600">
            Vientiane Cafe
          </button>
          <Bell className="h-4 w-4 text-emerald-500" />
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-300 to-blue-500" />
        </div>
      </div>
      <div className="grid gap-3 pt-3 md:grid-cols-[132px_1fr]">
        <aside className="hidden rounded-md bg-slate-50 p-2 md:block">
          {[
            "Dashboard",
            "Sales",
            "Transactions",
            "Products",
            "Customers",
            "Reports",
            "Settings"
          ].map((item, index) => (
            <div
              key={item}
              className={`font800 mb-1.5 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs ${
                index === 0 ? "bg-blue-100 text-blue-600" : "text-slate-500"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              {item}
            </div>
          ))}
        </aside>
        <div>
          {!compact ? (
            <div className="grid gap-2 md:grid-cols-4">
              {metrics.map(([label, value, change]) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-100 bg-white p-3"
                >
                  <p className="font800 text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-base font-black text-slate-950">{value}</p>
                  <p className="font800 mt-1 text-xs text-emerald-600">
                    {change} vs last week
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          <div
            className={`mt-2 grid gap-2 ${compact ? "md:grid-cols-3" : "md:grid-cols-[1.4fr_1fr_1fr]"}`}
          >
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font900 text-sm text-slate-950">Sales Overview</h3>
                <span className="font800 rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-500">
                  This Week
                </span>
              </div>
              <svg viewBox="0 0 320 150" className="h-[120px] w-full">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[30, 60, 90, 120].map((y) => (
                  <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#e5eefc" />
                ))}
                <path
                  d="M0 110 L48 72 L96 95 L144 56 L192 40 L240 82 L320 24 L320 150 L0 150 Z"
                  fill="url(#chartFill)"
                />
                <polyline
                  points="0,110 48,72 96,95 144,56 192,40 240,82 320,24"
                  fill="none"
                  stroke="#2563eb"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <h3 className="font900 text-sm text-slate-950">Top Products</h3>
              <div className="mt-3 space-y-2">
                {["Iced Latte", "Green Tea", "Croissant", "Bagel", "Brownie"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="h-8 w-8 rounded-md bg-gradient-to-br from-amber-200 to-amber-700" />
                        <span className="font800 text-xs text-slate-700">{item}</span>
                      </div>
                      <span className="font900 text-xs text-slate-900">
                        K {(index + 2) * 840},000
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font900 text-sm text-slate-950">Recent Transactions</h3>
                <span className="font900 text-xs text-blue-600">View all</span>
              </div>
              <div className="space-y-2">
                {["INV-00155", "INV-00154", "INV-00153", "INV-00152"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center justify-between">
                      <div>
                        <p className="font900 text-xs text-blue-600">{item}</p>
                        <p className="text-[10px] text-slate-500">
                          May 18, 11:{25 - index} AM
                        </p>
                      </div>
                      <p className="font900 text-xs text-slate-900">
                        K {65 + index * 25},000
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-6 max-w-3xl text-center">
      {eyebrow ? <p className="font900 mb-2 text-sm text-blue-600">{eyebrow}</p> : null}
      <h2 className="text-2xl font-black tracking-normal text-slate-950">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

function IconBox({ Icon, tone }: { Icon: LucideIcon; tone: string }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(tone)}`}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

function FeatureCard({ feature }: { feature: IconCard }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <IconBox Icon={feature.Icon} tone={feature.tone} />
        <div>
          <h3 className="font900 text-sm text-slate-950">{feature.title}</h3>
          <p className="mt-1.5 text-xs leading-5 text-slate-600">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function PosTypeCard({
  item,
  large = false
}: {
  item: (typeof posTypes)[number];
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-blue-100 bg-white shadow-sm ${
        large ? "p-5" : "p-3"
      }`}
    >
      <div className={`${large ? "mb-4" : "mb-3"} flex items-center gap-3`}>
        <IconBox Icon={item.Icon} tone={item.tone} />
        <h3 className={`${large ? "text-lg" : "text-sm"} font-black text-slate-950`}>
          {large ? item.title : item.shortTitle}
        </h3>
      </div>
      <div
        className={`${large ? "h-28" : "h-20"} rounded-md border border-blue-50`}
        style={{ background: item.visual }}
      />
      <p
        className={`${large ? "mt-4 text-sm leading-6" : "mt-3 text-xs leading-5"} text-slate-600`}
      >
        {item.description}
      </p>
      {large ? (
        <ul className="mt-4 space-y-2">
          {item.bullets.map((bullet) => (
            <li
              key={bullet}
              className="font700 flex items-center gap-2 text-sm text-slate-700"
            >
              <Check className="h-4 w-4 rounded-full bg-blue-600 p-0.5 text-white" />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href="/pos-types"
        className="font900 mt-3 inline-flex items-center gap-2 text-xs text-blue-600"
      >
        Learn more
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function AddOnCard({ item }: { item: (typeof addOns)[number] }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
      <IconBox Icon={item.Icon} tone={item.tone} />
      <h3 className="mt-3 text-sm font-black text-slate-950">{item.title}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">
        {item.description}
      </p>
      <p className="mt-3 text-lg font-black whitespace-nowrap text-slate-950">
        {item.price}
        <span className="font700 text-xs text-slate-500"> /month</span>
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button className="font900 h-8 rounded-md border border-blue-300 px-3 text-xs text-blue-600">
          Add
        </button>
        <Link
          href="/add-ons"
          className="font900 inline-flex items-center gap-1 text-xs text-blue-600"
        >
          More
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function PricingCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  return (
    <div
      className={`relative rounded-lg border bg-white p-5 shadow-sm ${
        plan.featured ? "border-blue-500 shadow-blue-100" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-4 left-1/2 -translate-x-1/2 rounded-md bg-blue-600 px-6 py-2 text-xs text-white">
          Most Popular
        </div>
      ) : null}
      <IconBox Icon={plan.Icon} tone={plan.featured ? "teal" : "blue"} />
      <h3 className="mt-3 text-lg font-black text-slate-950">{plan.name}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">{plan.subtitle}</p>
      <p className="mt-4 text-2xl font-black whitespace-nowrap text-blue-600">
        {plan.price}
        {plan.price !== "Custom" ? (
          <span className="font700 text-sm text-slate-500"> /month</span>
        ) : null}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {plan.price === "Custom" ? "Tailored to your needs" : "Billed monthly"}
      </p>
      <ul className="mt-4 space-y-2">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="font800 flex items-center gap-2 text-xs text-slate-700"
          >
            <Check className="h-3.5 w-3.5 text-blue-600" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={plan.name === "Enterprise" ? "/contact" : "/request-demo"}
        className={`font900 mt-5 flex h-9 items-center justify-center rounded-md border text-xs ${
          plan.featured
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-blue-300 bg-white text-blue-600"
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

function HomePosTypeCard({ item }: { item: (typeof posTypes)[number] }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-2.5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(item.tone)}`}
        >
          <item.Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-black text-slate-950">{item.shortTitle}</h3>
      </div>
      <div
        className="h-14 rounded-md border border-blue-50"
        style={{ background: item.visual }}
      />
      <p className="mt-2 min-h-8 text-[10px] leading-4 text-slate-600">
        {item.bullets[0]}.
      </p>
      <Link
        href="/pos-types"
        className="font900 mt-2 inline-flex items-center gap-1 text-xs text-blue-600"
      >
        Learn more
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function HomePricingCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  return (
    <div
      className={`relative rounded-lg border bg-white p-3 shadow-sm ${
        plan.featured ? "border-blue-500" : "border-blue-100"
      }`}
    >
      {plan.featured ? (
        <div className="font900 absolute -top-3 right-3 rounded-md bg-blue-600 px-3 py-1 text-[10px] text-white">
          Most Popular
        </div>
      ) : null}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(
          plan.featured ? "teal" : "blue"
        )}`}
      >
        <plan.Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-2 text-sm font-black text-slate-950">{plan.name}</h3>
      <p className="mt-1 min-h-6 text-[10px] leading-4 text-slate-600">
        {plan.subtitle}
      </p>
      <p className="mt-2 text-lg font-black whitespace-nowrap text-blue-600">
        {plan.price}
        {plan.price !== "Custom" ? (
          <span className="font700 text-[10px] text-slate-500"> /month</span>
        ) : null}
      </p>
      <ul className="mt-2 space-y-1">
        {plan.features.slice(0, 3).map((feature) => (
          <li
            key={feature}
            className="font800 flex items-center gap-1.5 text-[10px] text-slate-700"
          >
            <Check className="h-3 w-3 text-blue-600" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={plan.name === "Enterprise" ? "/contact" : "/request-demo"}
        className={`font900 mt-3 flex h-7 items-center justify-center rounded-md border text-[11px] ${
          plan.featured
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-blue-300 bg-white text-blue-600"
        }`}
      >
        {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
      </Link>
    </div>
  );
}

function HomeAddOnCard({ item }: { item: (typeof addOns)[number] }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-sm">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ${iconToneClass(item.tone)}`}
      >
        <item.Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-2 min-h-8 text-xs font-black text-slate-950">{item.title}</h3>
      <p className="mt-1 min-h-7 text-[10px] leading-4 text-slate-600">
        {item.description}
      </p>
      <p className="mt-2 text-sm font-black whitespace-nowrap text-slate-950">
        {item.price}
        <span className="font700 text-[10px] text-slate-500"> /month</span>
      </p>
      <button className="font900 mt-2 h-7 w-full rounded-md border border-blue-300 text-[11px] text-blue-600">
        Add
      </button>
    </div>
  );
}

function CTASection({
  title = "Need help choosing the right setup?",
  description = "Our experts are ready to understand your needs and recommend the best POS solution.",
  primaryLabel = "Request Demo",
  primaryHref = "/request-demo",
  secondaryLabel = "Contact TJ POS",
  secondaryHref = "/contact"
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mx-auto my-6 max-w-[1320px] px-6 lg:px-8">
      <div className="flex flex-col gap-5 rounded-lg border border-blue-200 bg-blue-50/70 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Headphones className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton href={primaryHref}>{primaryLabel}</PrimaryButton>
          <SecondaryButton href={secondaryHref}>{secondaryLabel}</SecondaryButton>
        </div>
      </div>
    </section>
  );
}

function ContactCards() {
  const cards = [
    [
      "Sales Inquiries",
      "Talk to our sales team about pricing and plans.",
      "sales@tjpos.la",
      User,
      "blue"
    ],
    [
      "Customer Support",
      "Get help with setup, billing or technical issues.",
      "support@tjpos.la",
      Headphones,
      "green"
    ],
    [
      "Call Us",
      "Speak with our team during business hours.",
      "+856 20 55 888 999",
      Phone,
      "orange"
    ],
    [
      "Email Us",
      "Send us an email anytime and we will respond.",
      "info@tjpos.la",
      Mail,
      "purple"
    ],
    [
      "Visit Our Office",
      "Meet us at our office in Vientiane, Laos.",
      "View on Map",
      Building2,
      "blue"
    ]
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(([title, body, value, Icon, tone]) => (
        <div
          key={title}
          className="rounded-lg border border-blue-100 bg-white p-6 text-center shadow-sm"
        >
          <div className="mx-auto w-fit">
            <IconBox Icon={Icon} tone={tone} />
          </div>
          <h3 className="mt-4 text-base font-black text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          <p className="font900 mt-4 text-sm text-blue-600">{value}</p>
          <p className="font800 mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Response within 2 hours
          </p>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  placeholder,
  wide = false,
  textarea = false,
  type = "text"
}: {
  label: string;
  placeholder: string;
  wide?: boolean;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="font900 text-sm text-slate-800">{label}</span>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          className="mt-2 h-32 w-full resize-none rounded-md border border-blue-100 px-4 py-3 text-sm transition outline-none placeholder:text-slate-400 focus:border-blue-400"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="mt-2 h-12 w-full rounded-md border border-blue-100 px-4 text-sm transition outline-none placeholder:text-slate-400 focus:border-blue-400"
        />
      )}
    </label>
  );
}

function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <label>
      <span className="font900 text-sm text-slate-800">{label}</span>
      <button className="font800 mt-2 flex h-12 w-full items-center justify-between rounded-md border border-blue-100 px-4 text-left text-sm text-slate-700">
        {value}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
    </label>
  );
}

export function HomePage() {
  return (
    <PageShell active="Home">
      <HeroShell
        badge="#1 POS Solution in Laos"
        title="Run Your Business Smarter with"
        accent="TJ POS"
        description="A complete, cloud-based POS platform for Retail, Cafe, Restaurant, Beauty and Hospitality businesses. Easy to use. Powerful features. Built for Laos."
        secondaryHref="/features"
        secondaryLabel="Explore Features"
        secondaryIcon={<Info className="h-4 w-4" />}
        showTrust
      >
        <DashboardMockup compact />
      </HeroShell>
      <section className="mx-auto grid max-w-[1320px] gap-8 px-6 py-5 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            Built for Every Business Type
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Powerful features tailored to how your business works.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {posTypes.map((item) => (
              <HomePosTypeCard key={item.title} item={item} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            Powerful Features to Grow Your Business
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {coreFeatures.slice(0, 6).map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-blue-100 bg-slate-50/40 py-5">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Simple Packages, One Powerful Platform
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {pricingPlans.map((plan) => (
                <HomePricingCard key={plan.name} plan={plan} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Add-ons to Do More</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {addOns.slice(0, 5).map((item) => (
                <HomeAddOnCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-5 lg:grid-cols-[0.95fr_1fr_0.85fr_0.85fr] lg:px-8">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            Trusted by Businesses Across Laos
          </h2>
          <div className="font900 mt-5 grid grid-cols-3 gap-3 text-center text-base text-slate-500">
            {[
              "Joma",
              "Vientiane Center",
              "BCEL",
              "Sabaidee Hotel",
              "Parkson",
              "Paragon"
            ].map((brand) => (
              <div
                key={brand}
                className="rounded-lg border border-blue-100 bg-white p-3"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950">What Our Customers Say</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "TJ POS helped us manage our cafe more efficiently.",
              "Reports and inventory features save us hours every day."
            ].map((quote, index) => (
              <div
                key={quote}
                className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-blue-300" />
                  <div>
                    <p className="font900 text-slate-950">
                      {index === 0 ? "Khampheng L." : "Vilayphone S."}
                    </p>
                    <p className="text-xs text-slate-500">Owner, Local Business</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{quote}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950">FAQ</h2>
          <div className="mt-5 space-y-2">
            {[
              "Is TJ POS cloud-based?",
              "Can I use TJ POS offline?",
              "Do you provide support in Laos?"
            ].map((question) => (
              <div
                key={question}
                className="rounded-md border border-blue-100 bg-white px-4 py-3"
              >
                <p className="font800 flex items-center justify-between text-sm text-slate-800">
                  {question}
                  <ChevronDown className="h-4 w-4" />
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
          </div>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-xl font-black text-blue-700">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Let us show you how TJ POS can help you sell more and manage easier.
          </p>
          <div className="mt-5">
            <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function PosTypesPage() {
  return (
    <PageShell active="POS Types">
      <HeroShell
        badge="#1 POS Solution in Laos"
        title="POS Types for"
        accent="Every Business"
        description="TJ POS supports multiple business models across Laos. Choose the right POS type that fits your operations and helps you grow."
        secondaryHref="/features"
        secondaryLabel="Explore Features"
        secondaryIcon={<Info className="h-4 w-4" />}
      >
        <div>
          <div className="mb-4 grid grid-cols-5 gap-3 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
            {posTypes.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-blue-100 p-4 text-center"
              >
                <div className="mx-auto w-fit">
                  <IconBox Icon={item.Icon} tone={item.tone} />
                </div>
                <p className="font900 mt-3 text-sm text-slate-950">{item.shortTitle}</p>
              </div>
            ))}
          </div>
          <DashboardMockup compact />
        </div>
      </HeroShell>
      <section className="mx-auto max-w-[1320px] px-6 py-12 lg:px-10">
        <SectionHeading
          title="Choose the Right POS Type for Your Business"
          description="Designed to match the way you sell, serve, and manage."
        />
        <div className="grid gap-5 lg:grid-cols-5">
          {posTypes.map((item) => (
            <PosTypeCard key={item.title} item={item} large />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 pb-12 lg:px-10">
        <SectionHeading
          title="Powerful Capabilities Shared Across All POS Types"
          description="One platform. All the essentials you need."
        />
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {coreFeatures.slice(0, 6).map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
      <CTASection title="Not sure which POS type fits you best?" />
    </PageShell>
  );
}

export function FeaturesPage() {
  return (
    <PageShell active="Features">
      <HeroShell
        badge="#1 POS Solution in Laos"
        title="Everything You Need, Built Into"
        accent="TJ POS"
        description="Powerful core features to run your business smoothly. Simple to use. Easy to manage. Built to help you grow."
        secondaryHref="/pricing"
        secondaryLabel="Explore Pricing"
        secondaryIcon={<Gift className="h-4 w-4" />}
      >
        <DashboardMockup />
      </HeroShell>
      <section className="mx-auto max-w-[1480px] px-6 py-6 lg:px-10">
        <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
      <section className="border-y border-blue-100 bg-slate-50/50 py-10">
        <div className="mx-auto grid max-w-[1320px] gap-5 px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-7">
            <h2 className="text-xl font-black text-emerald-700">
              Core Features Included in Every Plan
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {coreFeatures.slice(0, 8).map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto w-fit">
                    <IconBox Icon={feature.Icon} tone={feature.tone} />
                  </div>
                  <p className="font900 mt-2 text-xs text-slate-800">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-7">
            <h2 className="text-xl font-black text-violet-700">
              Optional Add-ons Extend Your System
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {addOns.slice(0, 8).map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto w-fit">
                    <IconBox Icon={item.Icon} tone={item.tone} />
                  </div>
                  <p className="font900 mt-2 text-xs text-slate-800">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}

export function PricingPage() {
  return (
    <PageShell active="Pricing">
      <section className="mx-auto max-w-[1320px] px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h1 className="text-5xl leading-tight font-black text-slate-950">
              Simple Pricing for{" "}
              <span className="text-blue-600">Growing Businesses</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Flexible plans designed for businesses of all sizes. Start small and scale
              up as you grow.
            </p>
            <div className="mt-8 flex gap-3">
              <button className="font900 h-12 rounded-md border border-blue-400 bg-white px-6 text-sm text-blue-600">
                Monthly billing
              </button>
              <button className="font800 h-12 rounded-md border border-slate-200 bg-white px-6 text-sm text-slate-500">
                Yearly billing
              </button>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-blue-100 py-10">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
          <h2 className="text-2xl font-black text-slate-950">Add-ons</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-7">
            {addOns.slice(0, 7).map((item) => (
              <AddOnCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-10 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
        <div className="rounded-lg border border-blue-100 p-6">
          <h2 className="text-xl font-black text-slate-950">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 space-y-3">
            {faqGroups[1].questions.map((question) => (
              <div
                key={question}
                className="rounded-md border border-blue-100 px-4 py-3"
              >
                <p className="font800 flex justify-between text-sm text-slate-800">
                  {question}
                  <ChevronDown className="h-4 w-4" />
                </p>
              </div>
            ))}
          </div>
        </div>
        <CTASection title="Not sure which plan fits your business?" />
      </section>
    </PageShell>
  );
}

export function AddOnsPage() {
  return (
    <PageShell active="Add-ons">
      <HeroShell
        badge="Activate Only What You Need"
        title="Power Up Your POS with"
        accent="Smart Add-ons"
        description="TJ POS is built to grow with your business. Enable only the modules you need and extend your system anytime."
        primaryHref="/contact"
        primaryLabel="Contact TJ POS"
        secondaryHref="/features"
        secondaryLabel="Explore Features"
        secondaryIcon={<Info className="h-4 w-4" />}
      >
        <DashboardMockup compact />
      </HeroShell>
      <section className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Featured Add-ons</h2>
            <p className="mt-2 text-sm text-slate-600">
              All add-ons are optional and can be added anytime.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {addOns.map((item) => (
            <AddOnCard key={item.title} item={item} />
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-5 px-6 pb-10 lg:grid-cols-[1.3fr_0.7fr] lg:px-10">
        <div className="grid gap-5 rounded-lg border border-blue-100 bg-blue-50/40 p-6 md:grid-cols-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Why Add-ons Matter</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Add-ons extend TJ POS to fit your unique operations.
            </p>
          </div>
          {[
            ["Increase Efficiency", "30%", "with process automation"],
            ["Boost Revenue", "20%", "with better tools and insights"],
            ["Better Experience", "25%", "with faster service"]
          ].map(([title, number, body]) => (
            <div key={title} className="rounded-lg border border-blue-100 bg-white p-5">
              <p className="font900 text-sm text-slate-950">{title}</p>
              <p className="mt-4 text-4xl font-black text-blue-600">{number}</p>
              <p className="mt-2 text-sm text-slate-500">{body}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-blue-100 bg-white p-6">
          <h2 className="text-xl font-black text-slate-950">
            Who Benefits from Add-ons?
          </h2>
          <div className="mt-5 space-y-4">
            {posTypes.map((item) => (
              <div key={item.title} className="flex gap-3">
                <IconBox Icon={item.Icon} tone={item.tone} />
                <div>
                  <p className="font900 text-sm text-slate-950">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}

export function FaqHelpPage() {
  return (
    <PageShell active="FAQ/Help">
      <section className="border-b border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div>
            <Badge Icon={Headphones}>Get Help, Fast</Badge>
            <h1 className="mt-6 text-5xl leading-tight font-black text-slate-950">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Find answers to common questions about TJ POS. Everything you need to know
              to run your business with confidence.
            </p>
          </div>
          <div className="flex items-center">
            <div className="w-full rounded-lg border border-blue-100 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                How can we help you today?
              </h2>
              <div className="mt-5 flex h-14 items-center gap-3 rounded-md border border-blue-100 px-4">
                <span className="text-sm text-slate-500">Search for answers...</span>
                <Search className="ml-auto h-5 w-5 text-slate-500" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Setup guide", "Pricing", "Add-ons", "Payments", "Reports"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="font900 rounded-md bg-blue-50 px-4 py-2 text-xs text-blue-600"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {faqGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm"
            >
              <IconBox Icon={group.Icon} tone={group.tone} />
              <h3 className="mt-4 text-lg font-black text-slate-950">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                View questions and support topics.
              </p>
              <Link
                href="#"
                className="font900 mt-4 inline-flex items-center gap-2 text-sm text-blue-600"
              >
                View questions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {faqGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <IconBox Icon={group.Icon} tone={group.tone} />
                <h2 className="text-xl font-black text-slate-950">{group.title}</h2>
              </div>
              <div className="space-y-3">
                {group.questions.map((question) => (
                  <div
                    key={question}
                    className="rounded-md border border-blue-100 px-4 py-3"
                  >
                    <p className="font800 flex justify-between text-sm text-slate-800">
                      {question}
                      <ChevronDown className="h-4 w-4" />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <CTASection title="Still need help?" secondaryLabel="Contact TJ POS" />
    </PageShell>
  );
}

export function ContactPage() {
  return (
    <PageShell active="Contact">
      <section className="border-b border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-[1320px] px-6 py-12 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <Badge>We're Here to Help</Badge>
              <h1 className="mt-6 text-5xl leading-tight font-black text-slate-950">
                Get in Touch with <span className="text-blue-600">TJ POS</span> Experts
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Have questions or need advice? Our team is ready to help you find the
                perfect POS solution for your business.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryButton href="/request-demo">Request Demo</PrimaryButton>
                <SecondaryButton
                  href="/faq-help"
                  icon={<CircleHelp className="h-4 w-4" />}
                >
                  View FAQ/Help
                </SecondaryButton>
              </div>
            </div>
            <ContactCards />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Send Us a Message</h2>
          <p className="mt-2 text-sm text-slate-600">
            Fill out the form and our team will get back to you shortly.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Full Name" placeholder="Enter your full name" />
            <Field label="Email Address" placeholder="Enter your email address" />
            <Field label="Phone Number" placeholder="Enter your phone number" />
            <SelectField label="Business Type" value="Select business type" />
            <Field label="Subject" placeholder="How can we help you?" wide />
            <Field
              label="Message"
              placeholder="Please tell us more about your business needs..."
              wide
              textarea
            />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <PrimaryButton href="#">Send Message</PrimaryButton>
            <p className="font700 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Your information is secure and never shared.
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Our Office</h2>
            <p className="mt-2 text-sm text-slate-600">
              Visit us at our headquarters in Vientiane Capital.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
              <div className="font800 space-y-3 text-sm text-slate-700">
                <p className="flex gap-2">
                  <MapPin className="h-4 w-4" /> Unit 45, Saysettha District
                </p>
                <p className="flex gap-2">
                  <Phone className="h-4 w-4" /> +856 20 55 888 999
                </p>
                <p className="flex gap-2">
                  <Mail className="h-4 w-4" /> info@tjpos.la
                </p>
              </div>
              <div className="relative h-56 overflow-hidden rounded-md border border-blue-100 bg-[linear-gradient(135deg,#eef5ff,#ffffff)]">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,#dbeafe_25%,transparent_26%,transparent_49%,#dbeafe_50%,transparent_51%,transparent_74%,#dbeafe_75%,transparent_76%),linear-gradient(0deg,transparent_24%,#dbeafe_25%,transparent_26%,transparent_49%,#dbeafe_50%,transparent_51%,transparent_74%,#dbeafe_75%,transparent_76%)]" />
                <div className="absolute top-1/2 left-1/2 rounded-lg bg-white p-4 shadow-lg">
                  <p className="font900 text-slate-950">TJ POS Co., Ltd.</p>
                  <p className="text-xs text-slate-500">Vientiane Capital, Laos</p>
                </div>
              </div>
            </div>
          </div>
          <CTASection title="Let's Find the Right Solution for Your Business" />
        </div>
      </section>
    </PageShell>
  );
}

export function RequestDemoPage() {
  return (
    <PageShell active="Contact">
      <HeroShell
        badge="See TJ POS in Action"
        title="Request a Personalized"
        accent="TJ POS Demo"
        description="See how TJ POS can simplify operations, boost efficiency and help your business grow. Our experts will walk you through a live demo tailored to your needs."
        showTrust
        trustItems={demoTrustItems}
        hideActions
      >
        <DashboardMockup />
      </HeroShell>
      <section className="mx-auto grid max-w-[1320px] gap-6 px-6 py-10 lg:grid-cols-[1.35fr_0.65fr] lg:px-10">
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Tell Us About Your Business
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Fill in the details below and our team will contact you to confirm your
            demo.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <Field label="Full Name" placeholder="Somchai Phomsavanh" />
            <Field label="Business Name" placeholder="Vientiane Cafe" />
            <SelectField label="Business Type" value="Cafe" />
            <Field label="Phone Number" placeholder="+856 20 55 888 999" />
            <Field label="Email Address" placeholder="somchai@vientianecafe.la" />
            <SelectField label="Number of Branches" value="3 Branches" />
            <SelectField label="Current Setup / System" value="Manual / Paper-based" />
            <SelectField
              label="Interested Modules"
              value="Sales & Billing, Inventory"
            />
            <SelectField label="Country / City" value="Laos, Vientiane Capital" />
            <Field label="Preferred Demo Date" placeholder="May 22, 2025" />
            <SelectField label="Preferred Time" value="10:00 AM" />
            <Field
              label="Notes / Requirements"
              placeholder="Tell us about your needs"
            />
          </div>
          <label className="font700 mt-6 flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 h-4 w-4 rounded border-blue-200"
            />
            I agree to the Terms of Service and Privacy Policy and consent to be
            contacted by TJ POS.
          </label>
          <div className="mt-6 flex gap-4">
            <PrimaryButton href="#">Submit Demo Request</PrimaryButton>
            <SecondaryButton href="#">Reset Form</SecondaryButton>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">What to Expect</h2>
            <div className="mt-5 space-y-5">
              {[
                [
                  "Live Product Demo",
                  "Explore key features and real-time system in action."
                ],
                [
                  "Tailored to Your Needs",
                  "See how TJ POS works for your setup and industry."
                ],
                ["Q&A with Experts", "Get answers to your questions on the spot."]
              ].map(([title, body], index) => (
                <div key={title} className="flex gap-3">
                  <IconBox
                    Icon={[LayoutDashboard, ShieldCheck, Headphones][index]}
                    tone="blue"
                  />
                  <div>
                    <p className="font900 text-slate-950">{title}</p>
                    <p className="text-sm leading-6 text-slate-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              Our 3-Step Demo Process
            </h2>
            <div className="mt-5 space-y-4">
              {[
                "Submit Your Request",
                "We Confirm & Prepare",
                "Live Demo & Consultation"
              ].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <span className="font900 flex h-8 w-8 items-center justify-center rounded-full border border-blue-300 text-sm text-blue-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font900 text-slate-950">{step}</p>
                    <p className="text-sm text-slate-600">
                      Our team guides you through the right solution.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-5 px-6 pb-4 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            TJ POS Supports Businesses Like Yours
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose your business type to see how we can help you grow.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {posTypes.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-2 rounded-md border border-blue-100 px-3 py-2"
              >
                <IconBox Icon={item.Icon} tone={item.tone} />
                <span className="font900 text-sm text-slate-900">
                  {item.shortTitle}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Headphones className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Need help choosing the right setup?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Our specialists are ready to help you find the best solution.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <PrimaryButton href="/contact">Contact TJ POS</PrimaryButton>
            <SecondaryButton href="#">Call Us</SecondaryButton>
          </div>
        </div>
      </section>
      <CTASection
        title="Ready to see TJ POS in action?"
        primaryLabel="Submit Demo Request"
      />
    </PageShell>
  );
}

export function AuthPage({ mode }: { mode: "login" | "forgot" | "reset" }) {
  const copy = {
    login: {
      title: "Login to TJ POS",
      description:
        "Access Platform Admin and Business Admin from one secure entry point.",
      primary: "Login",
      link: { href: "/forgot-password", label: "Forgot password?" }
    },
    forgot: {
      title: "Reset Your Password",
      description: "Enter your admin email and we will send reset instructions.",
      primary: "Send Reset Link",
      link: { href: "/login", label: "Back to login" }
    },
    reset: {
      title: "Create New Password",
      description: "Set a new secure password for your TJ POS admin account.",
      primary: "Update Password",
      link: { href: "/login", label: "Back to login" }
    }
  }[mode];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] text-slate-950">
      <header className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-10">
        <Logo />
        <Link href="/" className="font900 text-sm text-blue-600">
          Back to website
        </Link>
      </header>
      <main className="mx-auto grid max-w-[1180px] gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <section className="flex flex-col justify-center">
          <Badge Icon={ShieldCheck}>Secure Admin Access</Badge>
          <h1 className="mt-6 text-5xl leading-tight font-black text-slate-950">
            Smart POS for <span className="text-blue-600">Every Business</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Manage your platform, businesses, branches and POS operations with a clean,
            reliable admin experience.
          </p>
          <TrustPills />
        </section>
        <section className="rounded-lg border border-blue-100 bg-white p-8 shadow-[0_20px_70px_rgba(37,99,235,0.10)]">
          <h2 className="text-3xl font-black text-slate-950">{copy.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{copy.description}</p>
          <div className="mt-8 space-y-5">
            <Field label="Email Address" placeholder="admin@business.la" />
            {mode !== "forgot" ? (
              <Field
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
            ) : null}
            {mode === "reset" ? (
              <Field
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
              />
            ) : null}
          </div>
          <div className="mt-7">
            <PrimaryButton href="#">{copy.primary}</PrimaryButton>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-blue-100 pt-5">
            <Link href={copy.link.href} className="font900 text-sm text-blue-600">
              {copy.link.label}
            </Link>
            <Link href="/request-demo" className="font900 text-sm text-slate-500">
              Request Demo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
