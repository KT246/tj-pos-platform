export type BusinessCategory = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number | null;
  itemCount: number;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type BusinessCategoriesResponse = {
  categories: BusinessCategory[];
};

export type CreateBusinessCategoryBody = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number | null;
  status?: "active" | "inactive" | "archived";
};

export type UpdateBusinessCategoryBody = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number | null;
  status?: "active" | "inactive" | "archived";
};

export type DeleteBusinessCategoryResponse = {
  id: string;
  deleted: true;
};
