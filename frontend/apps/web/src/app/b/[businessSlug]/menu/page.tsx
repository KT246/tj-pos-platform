import {
  PublicMenuPage,
  PublicSearchResultsPage
} from "../../../../features/public-business/pages/public-business-pages";

type PageProps = {
  params: Promise<{ businessSlug: string }>;
  searchParams?: Promise<{ category?: string; search?: string; q?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { businessSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.search ?? resolvedSearchParams?.q;
  const category = resolvedSearchParams?.category;

  if (query) {
    return (
      <PublicSearchResultsPage
        businessSlug={businessSlug}
        query={query}
        category={category}
      />
    );
  }

  return <PublicMenuPage businessSlug={businessSlug} category={category} />;
}
