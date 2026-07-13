export type PromotionStatus = "active" | "paused" | "ended" | "upcoming";
export type PromotionType = "percent" | "amount" | "bogo" | "free-shipping" | "combo";
export type PromotionApplyScope = "all_order" | "category" | "product" | "combo" | "customer_group";

export type BusinessPromotion = {
  id: string;
  name: string;
  code: string;
  type: PromotionType;
  typeLabel: string;
  value: string;
  valueNote: string;
  period: string;
  remaining: string;
  status: PromotionStatus;
  image: string;
  appliesTo: string;
  scope: string;
  condition: string;
  exclusion: string;
  description: string;
  createdAt: string;
  createdBy: string;
  applyScope: PromotionApplyScope;
  targetIds: string[];
  minSubtotal: number;
  discountValue: number;
  maxDiscountAmount: number | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  daysOfWeek: number[];
};

export type PromotionKpi = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  tone: "green" | "amber" | "red";
};

export type BusinessPromotionsResponse = {
  promotions: BusinessPromotion[];
  kpis: PromotionKpi[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type SavePromotionBody = {
  name?: string;
  code?: string;
  type?: PromotionType;
  typeLabel?: string;
  value?: string;
  valueNote?: string;
  period?: string;
  remaining?: string;
  status?: PromotionStatus;
  image?: string | null;
  appliesTo?: string;
  scope?: string;
  condition?: string;
  exclusion?: string;
  description?: string;
  createdBy?: string;
  applyScope?: PromotionApplyScope;
  targetIds?: string[];
  minSubtotal?: number;
  discountValue?: number;
  maxDiscountAmount?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  daysOfWeek?: number[];
};

export type DeletePromotionResponse = {
  id: string;
  deleted: true;
};
