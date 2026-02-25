import { getBlogPosts } from "./markdown";
import { fetchLatestNews } from "./eclipse";

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
}

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
  let blogs = getBlogPosts();

  if (includeEF) {
    const efNews = await fetchLatestNews();

    const efPosts = efNews.news
      .filter(
        (newsItem: EclipseNewsItem) =>
          !newsItem.link.startsWith("https://adoptium.net"),
      )
      .map((newsItem: EclipseNewsItem) => ({
        slug: newsItem.link,
        newsItem,
        metadata: {
          title: newsItem.title,
          date: newsItem.date,
          tags: ["eclipse-news"],
          author: "eclipse-foundation",
          description: newsItem.body.substring(0, 150) + "...",
          featuredImage:
            newsItem.image && newsItem.image.trim() !== ""
              ? newsItem.image
              : "/images/backgrounds/ef-default-news.png",
        },
      }));

    blogs = [...blogs, ...efPosts];
  }

  // -------------------------
  // FILTERING PIPELINE
  // -------------------------

  // 1️⃣ Source Filter
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

  // 2️⃣ Tag Filter
  if (tag) {
    blogs = blogs.filter((post) => post.metadata.tags?.includes(tag));
  }

  // 3️⃣ Author Filter
  if (author) {
    blogs = blogs.filter((post) => post.metadata.author === author);
  }

  // -------------------------
  // SORTING
  // -------------------------
  const sortedBlogs = blogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });

  // -------------------------
  // PAGINATION
  // -------------------------
  const totalPages = Math.ceil(sortedBlogs.length / numPosts);
  const paginatedPosts = sortedBlogs.slice(
    (page - 1) * numPosts,
    page * numPosts,
  );

  return {
    posts: paginatedPosts,
    totalPages,
  };
}

export async function getNewsFilters({
  includeEF = true,
}: {
  includeEF?: boolean;
} = {}) {
  let blogs = getBlogPosts();

  if (includeEF) {
    const efNews = await fetchLatestNews();

    const efPosts = efNews.news
      .filter(
        (newsItem: EclipseNewsItem) =>
          !newsItem.link.startsWith("https://adoptium.net"),
      )
      .map((newsItem: EclipseNewsItem) => ({
        slug: newsItem.link,
        newsItem,
        metadata: {
          title: newsItem.title,
          date: newsItem.date,
          tags: ["eclipse-news"],
          author: "eclipse-foundation",
          description: newsItem.body.substring(0, 150) + "...",
          featuredImage:
            newsItem.image && newsItem.image.trim() !== ""
              ? newsItem.image
              : "/images/backgrounds/ef-default-news.png",
        },
      }));

    blogs = [...blogs, ...efPosts];
  }

  const tagSet = new Set<string>();
  const authorSet = new Set<string>();

  blogs.forEach((post) => {
    post.metadata.tags?.forEach((tag: string) => {
      if (tag) tagSet.add(tag);
    });

    if (post.metadata.author) {
      authorSet.add(post.metadata.author);
    }
  });

  return {
    tags: Array.from(tagSet).sort(),
    authors: Array.from(authorSet).sort(),
  };
}
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
