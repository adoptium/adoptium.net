import { notFound, redirect } from "next/navigation";
import PageHeader from "@/components/Common/PageHeader";
import NewsPageContent from "@/components/News/NewsPageContent";

interface PageProps {
  params: Promise<{ page: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const pageNumber = parseInt(resolvedParams.page, 10);

  if (pageNumber === 1) {
    redirect("/news");
  }
  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        subtitle="News"
        title="News & Updates"
        description="Follow the latest updates from the Eclipse Adoptium Project"
        className="mx-auto max-w-[860px] px-2 w-full"
      />

      <NewsPageContent
        pageNumber={pageNumber}
        searchParams={resolvedSearchParams}
        basePath="/news"
      />
    </div>
  );
}
