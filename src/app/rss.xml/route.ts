import RSS from 'rss';
import { getBlogPosts } from '@/utils/markdown';

export async function GET() {
  const posts = await getBlogPosts();
  const feed = new RSS({
    title: 'Adoptium Blog',
    description: 'Latest posts from the Eclipse Adoptium blog',
    feed_url: 'https://adoptium.net/rss.xml',
    site_url: 'https://adoptium.net',
  });

  posts.forEach((post) => {
    feed.item({
      title: post.metadata.title,
      description: post.metadata.description,
      url: `https://adoptium.net/news/${post.year}/${post.month}/${post.slug}`,
      guid: post.slug,
      date: post.metadata.date,
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
