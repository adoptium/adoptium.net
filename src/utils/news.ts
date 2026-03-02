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

function isAdoptiumHost(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.hostname === "adoptium.net";
  } catch {
    return false;
  }
}

async function getAllNewsData(includeEF: boolean) {
  let blogs = getBlogPosts();

  if (includeEF) {
    const efNews = await fetchLatestNews();

    const efPosts = efNews.news
      .filter((newsItem: EclipseNewsItem) => !isAdoptiumHost(newsItem.link))
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

  return blogs;
}

export async function getNewsPageData({
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
}) {
  const allBlogs = await getAllNewsData(includeEF);

  // -------------------------
  // DERIVE FILTER OPTIONS FROM FULL DATASET
  // -------------------------

  const tagSet = new Set<string>();
  const authorSet = new Set<string>();

  allBlogs.forEach((post) => {
    post.metadata.tags?.forEach((t) => {
      if (t) tagSet.add(t);
    });

    if (post.metadata.author) {
      authorSet.add(post.metadata.author);
    }
  });

  const tags = Array.from(tagSet).sort();
  const authors = Array.from(authorSet).sort();

  // -------------------------
  // APPLY FILTERING FOR DISPLAY
  // -------------------------

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

  if (tag) {
    blogs = blogs.filter((post) => post.metadata.tags?.includes(tag));
  }

  if (author) {
    blogs = blogs.filter((post) => post.metadata.author === author);
  }

  // -------------------------
  //  SORTING
  // -------------------------

  const sortedBlogs = blogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });

  // -------------------------
  //  PAGINATION
  // -------------------------

  const totalPages = Math.ceil(sortedBlogs.length / numPosts);

  const paginatedPosts = sortedBlogs.slice(
    (page - 1) * numPosts,
    page * numPosts,
  );

  return {
    posts: paginatedPosts,
    totalPages,
    tags,
    authors,
  };
}
