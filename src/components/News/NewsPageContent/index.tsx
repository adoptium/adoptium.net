import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getNewsPageData } from "@/utils/news";
import NewsFilters from "@/components/News/NewsFilters";
import NewsCardList from "@/components/News/NewsCardList";
import NewsEmptyState from "../NewsEmptyState";
import { sanitizeObject } from "@/utils/sanitize";
import type { CollectionPage, WithContext } from "schema-dts";
import { metadata as siteMetadata } from "@/utils/metadata";
import { parseNewsFilters } from "@/utils/parseNewsFilters";
import { getFormattedAuthorData } from "@/utils/authors";

interface Props {
  pageNumber: number;
  searchParams?: { [key: string]: string | string[] | undefined };
  basePath: string; // "/news"
}

export default async function NewsPageContent({
  pageNumber,
  searchParams,
  basePath,
}: Props) {
  const { tag, author, source } = parseNewsFilters(searchParams);
  const { posts, totalPages, tags, authors } = await getNewsPageData({
    numPosts: 9,
    page: pageNumber,
    includeEF: true,
    tag,
    author,
    source,
  });

  // Pagination guard (real 404)
  if (totalPages > 0 && pageNumber > totalPages) {
    notFound();
  }
  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const jsonLdSchema: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id":
      pageNumber === 1
        ? `${siteMetadata.siteUrl}/news`
        : `${siteMetadata.siteUrl}/news/page/${pageNumber}`,
    name: "Eclipse Adoptium News & Updates",
    url:
      pageNumber === 1
        ? `${siteMetadata.siteUrl}/news`
        : `${siteMetadata.siteUrl}/news/page/${pageNumber}`,
    mainEntity: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.metadata.title,
      url: post.metadata.tags?.includes("eclipse-news")
        ? post.slug
        : `${siteMetadata.siteUrl}/news/${post.year}/${post.month}/${post.slug}`,
      datePublished: new Date(post.metadata.date).toISOString(),
    })),
  };

  const sanitizedJsonLd = sanitizeObject(jsonLdSchema);

  const paramsBuilder = new URLSearchParams();
  if (tag) paramsBuilder.set("tag", tag);
  if (author) paramsBuilder.set("author", author);
  if (source) paramsBuilder.set("source", source);
  const queryString = paramsBuilder.toString();

  const previousPageLink =
    pageNumber > 2
      ? `${basePath}/page/${pageNumber - 1}${
          queryString ? `?${queryString}` : ""
        }`
      : `${basePath}${queryString ? `?${queryString}` : ""}`;

  const nextPageLink =
    pageNumber < totalPages
      ? `${basePath}/page/${pageNumber + 1}${
          queryString ? `?${queryString}` : ""
        }`
      : "";

  const tagOptions = tags.map((tag) => ({
    value: tag,
    label: tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  const authorOptions = authors.map((slug) => {
    const authorData = getFormattedAuthorData(slug);

    return {
      value: slug,
      label: authorData.name,
    };
  });
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sanitizedJsonLd),
        }}
      />

      <NewsFilters tags={tagOptions} authors={authorOptions} />

      {posts.length === 0 ? (
        <NewsEmptyState tag={tag} author={author} source={source} />
      ) : (
        <NewsCardList
          posts={posts}
          previousPageNumber={pageNumber > 1 ? pageNumber - 1 : null}
          previousPageLink={pageNumber > 1 ? previousPageLink : null}
          nextPage={nextPageLink}
          currentPage={pageNumber}
          totalPages={totalPages}
          baseUrl={basePath}
          queryString={queryString}
        />
      )}
    </>
  );
}
