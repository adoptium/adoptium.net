import { getBlogPosts } from "./markdown";

interface NewsResult {
  posts: ReturnType<typeof getBlogPosts>;
  totalPages: number;
}

export function getNews({numPosts = 6, page = 1} = {}): NewsResult {
  const blogs = getBlogPosts();
  const sortedBlogs = blogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA; // Sort in descending order
  });
  
  const totalPages = Math.ceil(sortedBlogs.length / numPosts);
  const paginatedPosts = sortedBlogs.slice((page - 1) * numPosts, page * numPosts);
  
  return {
    posts: paginatedPosts,
    totalPages
  };
}

export function getNewsByTag(tag: string, {numPosts = 6, page = 1} = {}): NewsResult {
  const blogs = getBlogPosts();
  const filteredBlogs = blogs.filter(post => post.metadata.tags?.includes(tag));
  
  const sortedBlogs = filteredBlogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA; // Sort in descending order
  });
  
  const totalPages = Math.ceil(sortedBlogs.length / numPosts);
  const paginatedPosts = sortedBlogs.slice((page - 1) * numPosts, page * numPosts);
  
  return {
    posts: paginatedPosts,
    totalPages
  };
}

export function getNewsByAuthor(author: string, { numPosts = 6, page = 1 } = {}): NewsResult {
  const blogs = getBlogPosts();
  const filteredBlogs = blogs.filter(post => post.metadata.author === author);

  const sortedBlogs = filteredBlogs.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA; // Sort in descending order
  });

  const totalPages = Math.ceil(sortedBlogs.length / numPosts);
  const paginatedPosts = sortedBlogs.slice((page - 1) * numPosts, page * numPosts);

  return {
    posts: paginatedPosts,
    totalPages
  };
}
