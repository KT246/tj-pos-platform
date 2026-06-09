import { OrdersView } from "../components/order-views";
import {
  CheckoutView,
  ReceiptPreviewView,
  RefundView
} from "../components/payment-views";
import {
  CloseShiftView,
  OfflineStateView,
  OpenShiftView
} from "../components/shift-views";
import type { ReactElement } from "react";
import type { PosType } from "../types";

type BaseScreenProps = {
  businessSlug: string;
};

type OrdersScreenProps = BaseScreenProps & {
  mode: "open-orders" | "held-orders";
};

export type PosScreenBundle = {
  OrdersView: (props: OrdersScreenProps) => ReactElement;
  CheckoutView: (props: BaseScreenProps) => ReactElement;
  ReceiptPreviewView: (props: BaseScreenProps) => ReactElement;
  RefundView: (props: BaseScreenProps) => ReactElement;
  OpenShiftView: (props: BaseScreenProps) => ReactElement;
  CloseShiftView: (props: BaseScreenProps) => ReactElement;
  OfflineStateView: (props: BaseScreenProps) => ReactElement;
};

function createBundle(posType: PosType): PosScreenBundle {
  return {
    OrdersView: (props) => <OrdersView {...props} screenPosType={posType} />,
    CheckoutView: (props) => <CheckoutView {...props} screenPosType={posType} />,
    ReceiptPreviewView: (props) => (
      <ReceiptPreviewView {...props} screenPosType={posType} />
    ),
    RefundView: (props) => <RefundView {...props} screenPosType={posType} />,
    OpenShiftView: (props) => <OpenShiftView {...props} screenPosType={posType} />,
    CloseShiftView: (props) => (
      <CloseShiftView {...props} screenPosType={posType} />
    ),
    OfflineStateView: (props) => (
      <OfflineStateView {...props} screenPosType={posType} />
    )
  };
}

const screenBundles: Record<PosType, PosScreenBundle> = {
  retail: createBundle("retail"),
  cafe: createBundle("cafe"),
  restaurant: createBundle("restaurant"),
  beauty: createBundle("beauty"),
  hospitality: createBundle("hospitality")
};

export function getPosScreenBundle(posType: PosType) {
  return screenBundles[posType];
}
