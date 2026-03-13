export type NewsFilters = {
  tag?: string;
  author?: string;
  source?: "adoptium" | "eclipse";
};

export function parseNewsFilters(searchParams?: {
  [key: string]: string | string[] | undefined;
}): NewsFilters {
  const tag =
    typeof searchParams?.tag === "string" ? searchParams.tag : undefined;

  const author =
    typeof searchParams?.author === "string" ? searchParams.author : undefined;

  const sourceRaw =
    typeof searchParams?.source === "string" ? searchParams.source : undefined;

  const allowedSources = ["adoptium", "eclipse"] as const;

  const source = allowedSources.includes(
    sourceRaw as (typeof allowedSources)[number],
  )
    ? (sourceRaw as "adoptium" | "eclipse")
    : undefined;

  return { tag, author, source };
}
