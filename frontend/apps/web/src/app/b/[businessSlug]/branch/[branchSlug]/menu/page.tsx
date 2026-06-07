import { PublicMenuPage } from "../../../../../../features/public-business/pages/public-business-pages";

type PageProps = {
  params: Promise<{ businessSlug: string; branchSlug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { businessSlug, branchSlug } = await params;

  return <PublicMenuPage businessSlug={businessSlug} branchSlug={branchSlug} />;
}
