import RSS from 'rss';
import { getBlogPosts } from '@/utils/markdown';
const BASE_SITE_URL = 'https://adoptium.net';

export async function GET() {
  const posts = await getBlogPosts();
  const feed = new RSS({
    title: 'Adoptium Blog',
    description: 'Latest posts from the Eclipse Adoptium blog',
    feed_url: `${BASE_SITE_URL}/rss.xml`,
    site_url: BASE_SITE_URL,
  });

  posts.forEach((post) => {
    feed.item({
      title: post.metadata.title,
      description: post.metadata.description,
      url: `${BASE_SITE_URL}/news/${post.year}/${post.month}/${post.slug}`,
      guid: post.slug,
      date: post.metadata.date,
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
