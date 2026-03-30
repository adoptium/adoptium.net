import { getBlogPosts } from "./markdown";
import { fetchLatestNews } from "./eclipse";
import { getFormattedAuthorData } from "@/utils/authors";

interface NewsResult {
  posts: ReturnType<typeof getBlogPosts>;
  totalPages: number;
}

// Interface for Eclipse Foundation news items
interface EclipseNewsItem {
  title: string;
  date: string;
  link: string;
  body: string;
  image?: string;
  author?: {
    full_name: string;
    username: string;
    picture: string;
  }[];
}

function isAdoptiumHost(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.hostname === "adoptium.net";
  } catch {
    return false;
  }
}

/**
 * Fetches and merges local blog posts with Eclipse Foundation news.
 * Single source of truth for news data.
 */
async function getAllNewsData(includeEF: boolean) {
  let blogs = getBlogPosts();

  if (includeEF) {
    const efNews = await fetchLatestNews();
    const efPosts = efNews.news
      .filter((newsItem: EclipseNewsItem) => !isAdoptiumHost(newsItem.link))
      .map((newsItem: EclipseNewsItem) => {
        const rawAuthor = newsItem.author?.[0]?.full_name?.trim();

        const authorName =
          rawAuthor && rawAuthor.length > 0 ? rawAuthor : "Eclipse Foundation";

        return {
          slug: newsItem.link,
          newsItem,
          metadata: {
            title: newsItem.title,
            date: newsItem.date,
            tags: ["eclipse-news"],
            author: authorName,
            description: newsItem.body.substring(0, 150) + "...",
            featuredImage:
              newsItem.image && newsItem.image.trim() !== ""
                ? newsItem.image
                : "/images/backgrounds/ef-default-news.png",
          },
        };
      });
    blogs = [...blogs, ...efPosts];
  }

  return blogs;
}

/**
  Unified data pipeline used by page-level rendering.
    Fetches all posts once, normalizes author data, derives filter options,
    applies filtering, sorting, and pagination.
 **/
export async function getNewsPageData({
  numPosts = 9,
  page = 1,
  includeEF = false,
  tag,
  author,
  source,
}: {
  numPosts?: number;
  page?: number;
  includeEF?: boolean;
  tag?: string | string[];
  author?: string;
  source?: "adoptium" | "eclipse";
}) {
  const rawBlogs = await getAllNewsData(includeEF);

  const tagSet = new Set<string>();
  const authorSet = new Set<string>();

  const allBlogs = rawBlogs.map((post) => {
    let normalizedPost = post;

    // Normalize markdown authors
    if (!post.metadata.tags?.includes("eclipse-news")) {
      const slug = post.metadata.author;

      if (slug) {
        const authorData = getFormattedAuthorData(slug);

        normalizedPost = {
          ...post,
          metadata: {
            ...post.metadata,
            author: authorData?.name || slug,
          },
        };
      }
    }

    // Derive filter options during same pass
    normalizedPost.metadata.tags?.forEach((t) => {
      if (t) tagSet.add(t);
    });

    if (normalizedPost.metadata.author) {
      authorSet.add(normalizedPost.metadata.author);
    }

    return normalizedPost;
  });
  // ---------------------------------
  // DERIVE FILTER OPTIONS (FULL DATASET)
  // ---------------------------------

  // Support multiple tags passed as comma-separated values
  const selectedTags = Array.isArray(tag)
    ? tag
    : typeof tag === "string"
      ? tag
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const tags = Array.from(tagSet).sort();
  const authors = Array.from(authorSet).sort();

  // ---------------------------------
  // APPLY FILTERING (DISPLAY DATASET)
  // ---------------------------------

  let blogs = [...allBlogs];

  if (source === "adoptium") {
    blogs = blogs.filter(
      (post) => !post.metadata.tags?.includes("eclipse-news"),
    );
  }

  if (source === "eclipse") {
    blogs = blogs.filter((post) =>
      post.metadata.tags?.includes("eclipse-news"),
    );
  }

  if (selectedTags.length > 0) {
    const normalizedTags = selectedTags.map((t) => t.toLowerCase());

    blogs = blogs.filter((post) =>
      normalizedTags.every((t) =>
        post.metadata.tags?.some((tag) => tag.toLowerCase() === t),
      ),
    );
  }

  if (author) {
    const normalizedAuthor = author.toLowerCase().replace(/\s+/g, "");

    blogs = blogs.filter((post) => {
      const postAuthor = post.metadata.author
        ?.toLowerCase()
        .replace(/\s+/g, "");

      return postAuthor === normalizedAuthor;
    });
  }

  // ---------------------------------
  // SORTING
  // ---------------------------------

  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });

  // ---------------------------------
  // PAGINATION
  // ---------------------------------

  const totalPages = Math.max(1, Math.ceil(sortedBlogs.length / numPosts));

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const paginatedPosts = sortedBlogs.slice(
    (safePage - 1) * numPosts,
    safePage * numPosts,
  );

  return {
    posts: paginatedPosts,
    totalPages,
    tags,
    authors,
  };
}

/* =========================================================
   Backward-Compatible Wrappers (Preserve Original API)
   ========================================================= */

/**
 * Original getNews API — now delegates to getNewsPageData
 */
export async function getNews({
  numPosts = 9,
  page = 1,
  includeEF = true,
  tag,
  author,
  source,
}: {
  numPosts?: number;
  page?: number;
  includeEF?: boolean;
  tag?: string;
  author?: string;
  source?: "adoptium" | "eclipse";
} = {}): Promise<NewsResult> {
  const { posts, totalPages } = await getNewsPageData({
    numPosts,
    page,
    includeEF,
    tag,
    author,
    source,
  });

  return { posts, totalPages };
}

/**
 * Original getNewsFilters API — returns full filter set
 */
export async function getNewsFilters({
  includeEF = true,
}: {
  includeEF?: boolean;
} = {}) {
  const { tags, authors } = await getNewsPageData({
    includeEF,
  });

  return { tags, authors };
}

/**
 * Original getNewsByTag API
 */
export async function getNewsByTag(
  tag: string,
  { numPosts = 6, page = 1 } = {},
) {
  return getNews({
    tag,
    numPosts,
    page,
  });
}

/**
 * Original getNewsByAuthor API
 */
export async function getNewsByAuthor(
  author: string,
  { numPosts = 6, page = 1 } = {},
) {
  return getNews({
    author,
    numPosts,
    page,
  });
}
