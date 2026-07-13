export type BrandingStyleMode = "clean" | "compact" | "featured";

export type BusinessBranding = {
  id: string | null;
  businessId: string;
  businessSlug: string;
  businessName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  bannerUrl: string | null;
  menuStyle: BrandingStyleMode;
  customerDisplayStyle: BrandingStyleMode;
  receiptFooter: string | null;
  updatedAt: string | null;
};

export type UpdateBusinessBrandingBody = {
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  backgroundColor?: string | null;
  bannerUrl?: string | null;
  menuStyle?: BrandingStyleMode | null;
  customerDisplayStyle?: BrandingStyleMode | null;
  receiptFooter?: string | null;
};
