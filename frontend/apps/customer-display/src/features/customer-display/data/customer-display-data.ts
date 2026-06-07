import {
  Banknote,
  CreditCard,
  Landmark,
  QrCode
} from "lucide-react";

import type {
  CustomerBankDetails,
  CustomerBusinessBrand,
  CustomerDisplayDevice,
  CustomerDisplayOrder,
  CustomerPaymentMethod
} from "../types";

export const customerBusinessBrand: CustomerBusinessBrand = {
  name: "TJ POS",
  logo: "/terminal-logo.png",
  branch: "TJ Cafe Vientiane",
  status: "Ready"
};

export const customerDisplayDevice: CustomerDisplayDevice = {
  id: "CD-COUNTER-01",
  name: "Counter Display 01",
  cashier: "Somchai P.",
  time: "10:24 AM",
  pairCode: "824 519"
};

export const customerDisplayOrder: CustomerDisplayOrder = {
  id: "#ORD-1058",
  customer: "Somchai P.",
  table: "Counter",
  paymentMethod: "qr-code",
  lines: [
    {
      id: "line-iced-latte",
      name: "Iced Latte",
      quantity: 1,
      unitPrice: 28000,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=160&q=80"
    },
    {
      id: "line-hot-latte",
      name: "Hot Latte",
      quantity: 1,
      unitPrice: 27000,
      image:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=160&q=80"
    },
    {
      id: "line-croissant",
      name: "Croissant",
      quantity: 1,
      unitPrice: 18000,
      image:
        "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=160&q=80"
    },
    {
      id: "line-club-sandwich",
      name: "Club Sandwich",
      quantity: 1,
      unitPrice: 38000,
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=160&q=80"
    }
  ],
  summary: {
    subtotal: 111000,
    serviceCharge: 5550,
    discount: 5000,
    total: 111550
  }
};

export const customerBankDetails: CustomerBankDetails = {
  bankName: "TJ Business Bank",
  accountName: "TJ Cafe Vientiane",
  accountNo: "001-245-8899",
  reference: "ORD-1058",
  qrImageUrl:
    "https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=12&data=TJ-POS%7CORD-1058%7CLAK-111550"
};

export const customerPaymentMethods: CustomerPaymentMethod[] = [
  { id: "cash", label: "Cash", icon: Banknote, tone: "green" },
  { id: "bank-transfer", label: "Bank Transfer", icon: Landmark, tone: "blue" },
  { id: "qr-code", label: "QR Code", icon: QrCode, tone: "blue" },
  { id: "card", label: "Card", icon: CreditCard, tone: "violet" }
];
