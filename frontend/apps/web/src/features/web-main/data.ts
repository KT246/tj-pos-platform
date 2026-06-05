import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Coffee,
  CreditCard,
  Gift,
  Headphones,
  Hotel,
  LayoutDashboard,
  PackageCheck,
  ReceiptText,
  Rocket,
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

import type { AddOn, FaqGroup, IconCard, PosType, PricingPlan } from "./types";

export const posTypes: PosType[] = [
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

export const coreFeatures: IconCard[] = [
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

export const homeCoreFeatures: IconCard[] = [
  {
    title: "Sales & Billing",
    description: "Fast billing, multiple payment methods and receipts.",
    Icon: BriefcaseBusiness,
    tone: "blue"
  },
  {
    title: "Inventory Management",
    description: "Real-time stock tracking, alerts and adjustments.",
    Icon: PackageCheck,
    tone: "teal"
  },
  {
    title: "Reports & Analytics",
    description: "Insightful reports to track performance anytime.",
    Icon: TrendingUp,
    tone: "green"
  },
  {
    title: "Customer Management",
    description: "Build customer profiles and reward loyalty.",
    Icon: Users,
    tone: "orange"
  },
  {
    title: "Employee Management",
    description: "Manage staff, roles, permissions and shifts.",
    Icon: User,
    tone: "purple"
  },
  {
    title: "Multi-Store Management",
    description: "Centralized control for multiple locations.",
    Icon: Store,
    tone: "blue"
  }
];

export const addOns: AddOn[] = [
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

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    subtitle: "Perfect for small businesses just getting started.",
    price: "K 120,000",
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

export const faqGroups: FaqGroup[] = [
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
