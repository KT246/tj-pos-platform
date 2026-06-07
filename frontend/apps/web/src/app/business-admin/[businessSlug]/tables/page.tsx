import { CafeFloorTableMapPage } from "../../../../features/business-admin/pages/cafe-specific-pages";
import { RestaurantAreasTablesPage } from "../../../../features/business-admin/pages/restaurant-specific-pages";

type PageProps = {
  params: Promise<{
    businessSlug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { businessSlug } = await params;

  if (businessSlug.toLowerCase().includes("restaurant")) {
    return <RestaurantAreasTablesPage />;
  }

  return <CafeFloorTableMapPage />;
}
