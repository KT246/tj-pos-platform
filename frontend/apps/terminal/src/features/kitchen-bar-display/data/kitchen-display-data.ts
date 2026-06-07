import {
  ChefHat,
  Coffee,
  CookingPot,
  PackageCheck,
  Utensils,
  Wine
} from "lucide-react";

import type {
  KitchenBusiness,
  KitchenSettings,
  KitchenStation,
  KitchenTicket
} from "../types";

export const kitchenBusiness: KitchenBusiness = {
  name: "TJ POS",
  logo: "/terminal-logo.png",
  branch: "TJ Cafe Vientiane",
  currentTime: "10:24 AM",
  currentDate: "May 18, 2025"
};

export const kitchenStations: KitchenStation[] = [
  { id: "all", label: "All Stations", icon: ChefHat },
  { id: "kitchen", label: "Kitchen", icon: CookingPot },
  { id: "bar", label: "Bar", icon: Wine },
  { id: "bakery", label: "Bakery", icon: Coffee },
  { id: "pass", label: "Pass", icon: PackageCheck }
];

export const defaultKitchenSettings: KitchenSettings = {
  enabledStationIds: ["kitchen", "bar", "bakery", "pass"],
  autoRefreshSeconds: 5,
  density: "comfortable",
  showItemNotes: true,
  showElapsedTime: true,
  autoPrintTickets: false,
  largePrintText: true
};

export const kitchenTickets: KitchenTicket[] = [
  {
    id: "#ORD-05029",
    orderNo: "ORD-05029",
    table: "Table 06",
    type: "Dine In",
    station: "kitchen",
    status: "new",
    priority: "High",
    elapsedMinutes: 2,
    assignedTo: "Unassigned",
    receivedAt: "10:22 AM",
    customerName: "Khampheng L.",
    customerNote: "Guest asked for quick service.",
    kitchenNote: "Fire mains together. Hold dessert until called.",
    items: [
      {
        id: "item-05029-1",
        quantity: 2,
        name: "Pad Thai (Chicken)",
        modifiers: ["No peanuts", "Medium spice"],
        note: "One plate no bean sprouts",
        unitPrice: 45000
      },
      {
        id: "item-05029-2",
        quantity: 1,
        name: "Fresh Spring Roll (Pork)",
        note: "Extra dipping sauce",
        unitPrice: 32000
      },
      {
        id: "item-05029-3",
        quantity: 1,
        name: "Lime Soda",
        modifiers: ["Less ice"],
        unitPrice: 18000
      }
    ]
  },
  {
    id: "#ORD-05018",
    orderNo: "ORD-05018",
    table: "Table 12",
    type: "Dine In",
    station: "kitchen",
    status: "new",
    priority: "High",
    elapsedMinutes: 11,
    assignedTo: "Unassigned",
    receivedAt: "10:13 AM",
    customerName: "Walk-in Customer",
    customerNote: "Birthday table.",
    kitchenNote: "Extra spicy please",
    items: [
      { id: "item-05018-1", quantity: 1, name: "Tom Yum Goong", unitPrice: 55000 },
      {
        id: "item-05018-2",
        quantity: 1,
        name: "Green Tea Matcha Latte",
        note: "Less sugar",
        unitPrice: 30000
      },
      { id: "item-05018-3", quantity: 1, name: "Steamed Rice", unitPrice: 10000 },
      { id: "item-05018-4", quantity: 1, name: "Mango Sticky Rice", unitPrice: 28000 }
    ]
  },
  {
    id: "#ORD-05017",
    orderNo: "ORD-05017",
    table: "Take Away",
    type: "Take Away",
    station: "bakery",
    status: "new",
    priority: "Normal",
    elapsedMinutes: 9,
    assignedTo: "Unassigned",
    receivedAt: "10:15 AM",
    customerName: "Vilayphone S.",
    customerNote: "Packing for takeaway.",
    kitchenNote: "No straw",
    items: [
      { id: "item-05017-1", quantity: 2, name: "Croissant", unitPrice: 18000 },
      { id: "item-05017-2", quantity: 1, name: "Chocolate Muffin", unitPrice: 22000 },
      {
        id: "item-05017-3",
        quantity: 1,
        name: "Iced Americano",
        modifiers: ["Less ice"],
        unitPrice: 25000
      }
    ]
  },
  {
    id: "#ORD-05016",
    orderNo: "ORD-05016",
    table: "Table 09",
    type: "Dine In",
    station: "bar",
    status: "new",
    priority: "Normal",
    elapsedMinutes: 7,
    assignedTo: "Unassigned",
    receivedAt: "10:17 AM",
    customerName: "Souvanna L.",
    customerNote: "Two guests waiting.",
    kitchenNote: "1 cup no ice",
    items: [
      { id: "item-05016-1", quantity: 2, name: "Iced Latte", unitPrice: 28000 },
      { id: "item-05016-2", quantity: 1, name: "Blueberry Cheesecake", unitPrice: 34000 },
      { id: "item-05016-3", quantity: 1, name: "Paper Cup 12oz", unitPrice: 0 }
    ]
  },
  {
    id: "#ORD-05019",
    orderNo: "ORD-05019",
    table: "Table 02",
    type: "Dine In",
    station: "kitchen",
    status: "preparing",
    priority: "High",
    elapsedMinutes: 18,
    assignedTo: "Sone K.",
    receivedAt: "10:06 AM",
    customerName: "Phonephip P.",
    customerNote: "Regular guest.",
    kitchenNote: "Extra spicy please",
    items: [
      { id: "item-05019-1", quantity: 1, name: "Tom Yum Goong", unitPrice: 55000 },
      { id: "item-05019-2", quantity: 1, name: "Green Tea Matcha Latte", unitPrice: 30000 },
      { id: "item-05019-3", quantity: 1, name: "Steamed Rice", unitPrice: 10000 },
      { id: "item-05019-4", quantity: 1, name: "Mango Sticky Rice", unitPrice: 28000 }
    ]
  },
  {
    id: "#ORD-05012",
    orderNo: "ORD-05012",
    table: "Take Away",
    type: "Take Away",
    station: "bar",
    status: "preparing",
    priority: "Normal",
    elapsedMinutes: 16,
    assignedTo: "Souvanna L.",
    receivedAt: "10:08 AM",
    customerName: "Online Order",
    customerNote: "Pickup counter.",
    kitchenNote: "Less ice please",
    items: [
      { id: "item-05012-1", quantity: 2, name: "Iced Americano", unitPrice: 25000 },
      { id: "item-05012-2", quantity: 1, name: "Croissant", unitPrice: 18000 },
      { id: "item-05012-3", quantity: 1, name: "Chocolate Muffin", unitPrice: 22000 }
    ]
  },
  {
    id: "#ORD-05023",
    orderNo: "ORD-05023",
    table: "Table 07",
    type: "Dine In",
    station: "kitchen",
    status: "preparing",
    priority: "High",
    elapsedMinutes: 14,
    assignedTo: "Phonephip P.",
    receivedAt: "10:10 AM",
    customerName: "Walk-in Customer",
    customerNote: "Family table.",
    kitchenNote: "No onions in soup",
    items: [
      {
        id: "item-05023-1",
        quantity: 1,
        name: "Pad Thai (Chicken)",
        modifiers: ["No onions"],
        unitPrice: 45000
      },
      { id: "item-05023-2", quantity: 1, name: "Thai Iced Tea", unitPrice: 25000 },
      { id: "item-05023-3", quantity: 1, name: "Lime Soda", unitPrice: 18000 },
      { id: "item-05023-4", quantity: 1, name: "Fresh Spring Roll (Pork)", unitPrice: 32000 }
    ]
  },
  {
    id: "#ORD-05027",
    orderNo: "ORD-05027",
    table: "Take Away",
    type: "Take Away",
    station: "bar",
    status: "preparing",
    priority: "Normal",
    elapsedMinutes: 13,
    assignedTo: "Khamphou V.",
    receivedAt: "10:11 AM",
    customerName: "Delivery Partner",
    customerNote: "Driver waiting near counter.",
    kitchenNote: "1 cup no ice",
    items: [
      { id: "item-05027-1", quantity: 2, name: "Iced Latte", unitPrice: 28000 },
      { id: "item-05027-2", quantity: 1, name: "Blueberry Cheesecake", unitPrice: 34000 },
      { id: "item-05027-3", quantity: 1, name: "Paper Cup 12oz", unitPrice: 0 }
    ]
  },
  {
    id: "#ORD-05031",
    orderNo: "ORD-05031",
    table: "Table 03",
    type: "Dine In",
    station: "pass",
    status: "ready",
    priority: "Normal",
    elapsedMinutes: 5,
    assignedTo: "Pass Station",
    receivedAt: "10:19 AM",
    customerName: "Walk-in Customer",
    customerNote: "Runner should confirm table.",
    kitchenNote: "Ready for pickup",
    items: [
      { id: "item-05031-1", quantity: 1, name: "Khao Piak Sen", unitPrice: 42000 },
      { id: "item-05031-2", quantity: 1, name: "Iced Latte", unitPrice: 28000 }
    ]
  },
  {
    id: "#ORD-05030",
    orderNo: "ORD-05030",
    table: "Counter",
    type: "Take Away",
    station: "pass",
    status: "ready",
    priority: "High",
    elapsedMinutes: 8,
    assignedTo: "Pass Station",
    receivedAt: "10:16 AM",
    customerName: "Noy M.",
    customerNote: "Call customer name clearly.",
    kitchenNote: "Package soup separately",
    items: [
      { id: "item-05030-1", quantity: 1, name: "Massaman Curry (Chicken)", unitPrice: 52000 },
      { id: "item-05030-2", quantity: 1, name: "Jasmine Rice", unitPrice: 10000 },
      { id: "item-05030-3", quantity: 1, name: "Coconut Smoothie", unitPrice: 24000 }
    ]
  }
];
