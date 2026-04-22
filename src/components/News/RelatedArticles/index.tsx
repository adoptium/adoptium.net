import React from "react";
import EventCard from "@/components/Events/EventCard";
import { getBlogPosts } from "@/utils/markdown";

interface RelatedArticlesProps {
  currentSlug: string;
  tags?: string[];
  maxArticles?: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentSlug,
  tags = [],
  maxArticles = 3,
}) => {
  // Get all posts except the current one
  const posts = getBlogPosts().filter((post) => post.slug !== currentSlug);

  // If tags are provided, filter by shared tags, otherwise just pick latest
  let related = posts;
  if (tags.length > 0) {
    related = posts.filter((post) =>
      post.metadata.tags?.some((tag) => tags.includes(tag)),
    );
  }

  // Sort by date (newest first)
  related = related.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });

  // Limit to maxArticles
  related = related.slice(0, maxArticles);

  if (related.length === 0) return null;

  return (
    <div className="w-full max-w-[1264px] mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-white/10 light:border-gray-200">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white light:text-gray-900 tracking-tight mb-4">
          Related Articles
        </h2>
        <p className="text-gray-400 light:text-gray-500 text-lg leading-relaxed">
          Explore more articles based on similar topics.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((post) => (
          <EventCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
