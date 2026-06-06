import { create } from "zustand";

import {
  customerDisplayDevice,
  customerDisplayOrder
} from "../data/customer-display-data";
import type {
  CustomerDisplayOrder,
  CustomerDisplayScreen,
  CustomerPaymentMethodId
} from "../types";

type CustomerDisplayState = {
  screen: CustomerDisplayScreen;
  deviceId: string;
  selectedPaymentMethod: CustomerPaymentMethodId;
  order: CustomerDisplayOrder;
};

type CustomerDisplayActions = {
  setScreen: (screen: CustomerDisplayScreen) => void;
  setDeviceId: (deviceId: string) => void;
  setSelectedPaymentMethod: (method: CustomerPaymentMethodId) => void;
};

// Customer display mirrors POS state in memory only. Do not persist until
// POS-device sync and offline behavior are defined with backend.
export const useCustomerDisplayStore = create<
  CustomerDisplayState & CustomerDisplayActions
>((set) => ({
  screen: "idle",
  deviceId: customerDisplayDevice.id,
  selectedPaymentMethod: customerDisplayOrder.paymentMethod,
  order: customerDisplayOrder,
  setScreen: (screen) => set({ screen }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method })
}));
