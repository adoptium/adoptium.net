import PageHeader from "@/components/Common/PageHeader";
import NewsPageContent from "@/components/News/NewsPageContent";

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <div>
      <PageHeader
        subtitle="News"
        title="News & Updates"
        description="Follow the latest updates from the Eclipse Adoptium Project"
        className="mx-auto max-w-[860px] px-2 w-full"
        compact
      />

      <NewsPageContent
        pageNumber={1}
        searchParams={resolvedSearchParams}
        basePath="/news"
      />
    </div>
  );
}
