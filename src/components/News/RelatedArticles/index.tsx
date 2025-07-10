import React from "react";
import EventCard from "@/components/EventCard";
import { getBlogPosts } from "@/utils/markdown";

interface RelatedArticlesProps {
    currentSlug: string;
    tags?: string[];
    maxArticles?: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentSlug, tags = [], maxArticles = 3 }) => {
    // Get all posts except the current one
    const posts = getBlogPosts().filter((post) => post.slug !== currentSlug);

    // If tags are provided, filter by shared tags, otherwise just pick latest
    let related = posts;
    if (tags.length > 0) {
        related = posts.filter((post) =>
            post.metadata.tags?.some((tag) => tags.includes(tag))
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
        <div className="mt-16 w-full max-w-[1264px] px-0 sm:px-6 mx-auto py-8 md:py-16">
            <div className="w-full max-w-[670px] mx-auto flex flex-col items-center justify-center px-4 sm:px-0">
                <h2 className="text-5xl leading-[116%] text-white text-center font-semibold">Related Articles</h2>
                <p className="text-lg leading-7 text-grey-300 text-center mt-4">
                    Explore more articles that might interest you based on your reading history.
                </p>
            </div>
            <div className="flex justify-center flex-wrap items-center gap-5 pt-8 px-2 sm:px-0">
                {related.map((post) => (
                    <EventCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
};

export default RelatedArticles;
