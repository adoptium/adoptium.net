import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { formatDate } from "@/utils/date";
import { sanitizeString } from "@/utils/sanitize";
import { getFormattedAuthorData } from "@/utils/authors";

interface EventCardProps {
  post: {
    slug: string;
    year: string;
    month: string;
    metadata: {
      title: string;
      description: string;
      date: string;
      featuredImage?: string;
      tags?: string[];
      author?: string;
    };
  };
  isEclipseNews?: boolean;
  priority?: boolean;
}

const EventCard = ({ post, isEclipseNews, priority }: EventCardProps) => {
  const locale = useLocale();

  const isExternalLink =
    isEclipseNews || post.metadata.tags?.includes("eclipse-news");

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const title = post.metadata.title || "Untitled";
  const description = post.metadata.description || "";
  const date = formatDate(post.metadata.date, locale) || "";
  const authorName = post.metadata.author
    ? getFormattedAuthorData(post.metadata.author).name !== "Unknown Author"
      ? getFormattedAuthorData(post.metadata.author).name
      : post.metadata.author
    : undefined;

  return (
    <div className="group flex flex-col w-full rounded-2xl border border-white/10 light:border-gray-200 bg-white/[0.03] light:bg-white backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20 light:hover:border-gray-300 hover:shadow-xl hover:shadow-purple/10 light:hover:shadow-gray-200/50 light:shadow-sm">
      <div className="relative h-[200px] overflow-hidden">
        {post.metadata.featuredImage ? (
          <Image
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            src={post.metadata.featuredImage}
            fill
            sizes="(max-width: 768px) 100vw, 385px"
            alt={title}
            priority={priority}
          />
        ) : (
          <Image
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            src={`/news/${post.year}/${post.month}/${post.slug}/opengraph-image`}
            fill
            sizes="(max-width: 768px) 100vw, 385px"
            alt={title}
            priority={priority}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-400 light:text-gray-500 mb-3">
          <time>{date}</time>
          {authorName && (
            <>
              <span className="text-gray-600">·</span>
              <span className="text-pink">{authorName}</span>
            </>
          )}
        </div>

        <h3
          className="text-lg font-semibold text-white light:text-gray-900 leading-snug line-clamp-2 mb-3 group-hover:text-pink transition-colors"
          title={title}
        >
          {truncateText(title, 90)}
        </h3>

        <p className="line-clamp-3 text-sm text-gray-400 light:text-gray-600 leading-relaxed flex-grow mb-5">
          {truncateText(description, 200)}
        </p>

        <div className="mt-auto">
          {isExternalLink ? (
            <a
              href={
                typeof post.slug === "string" ? sanitizeString(post.slug) : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-pink hover:underline transition-colors"
            >
              Read article
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : (
            <Link
              href={{
                pathname: `/news/${sanitizeString(post.year)}/${sanitizeString(post.month)}/${sanitizeString(post.slug)}`,
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-pink hover:underline transition-colors"
            >
              Read more
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
