import { PublicMenuItemPage } from "../../../../../features/public-business/pages/public-business-pages";

type PageProps = {
  params: Promise<{ businessSlug: string; itemSlug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { businessSlug, itemSlug } = await params;

  return <PublicMenuItemPage businessSlug={businessSlug} itemSlug={itemSlug} />;
}
