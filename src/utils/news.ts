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
  includeEF = false,
} = {}): Promise<NewsResult> {
  const blogs = getBlogPosts();
  if (includeEF) {
    const efNews = await fetchLatestNews();
    // structure efNews to match the blog posts format
    const efPosts = efNews.news
      .filter(
        (newsItem: EclipseNewsItem) =>
          !newsItem.link.startsWith("https://adoptium.net")
      )
      .map((newsItem: EclipseNewsItem) => ({
        slug: newsItem.link,
        newsItem,
        metadata: {
          title: newsItem.title,
          date: newsItem.date,
          tags: ["eclipse-news"],
          author: "Eclipse Foundation",
          description: newsItem.body.substring(0, 150) + "...",
          featuredImage:
            newsItem.image && newsItem.image.trim() !== ""
              ? newsItem.image
              : "/images/backgrounds/ef-default-news.png",
        },
      }));
    // Combine the blog posts with the EF news posts
    blogs.push(...efPosts);
  }

  const sortedBlogs = blogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA; // Sort in descending order
  });

  const totalPages = Math.ceil(sortedBlogs.length / numPosts);
  const paginatedPosts = sortedBlogs.slice(
    (page - 1) * numPosts,
    page * numPosts
  );

  return {
    posts: paginatedPosts,
    totalPages,
  };
}

export function getNewsByTag(
  tag: string,
  { numPosts = 6, page = 1 } = {}
): NewsResult {
  const blogs = getBlogPosts();
  const filteredBlogs = blogs.filter((post) =>
    post.metadata.tags?.includes(tag)
  );

  const sortedBlogs = filteredBlogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA; // Sort in descending order
  });

  const totalPages = Math.ceil(sortedBlogs.length / numPosts);
  const paginatedPosts = sortedBlogs.slice(
    (page - 1) * numPosts,
    page * numPosts
  );

  return {
    posts: paginatedPosts,
    totalPages,
  };
}

export function getNewsByAuthor(
  author: string,
  { numPosts = 6, page = 1 } = {}
): NewsResult {
  const blogs = getBlogPosts();
  const filteredBlogs = blogs.filter((post) => post.metadata.author === author);

  const sortedBlogs = filteredBlogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA; // Sort in descending order
  });

  const totalPages = Math.ceil(sortedBlogs.length / numPosts);
  const paginatedPosts = sortedBlogs.slice(
    (page - 1) * numPosts,
    page * numPosts
  );

  return {
    posts: paginatedPosts,
    totalPages,
  };
}
