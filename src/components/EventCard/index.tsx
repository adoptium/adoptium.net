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
    ? getFormattedAuthorData(post.metadata.author).name
    : undefined;

  return (
    <div className="flex flex-col w-full rounded-3xl newscard-2 bg-[#200D46]">
      <div className="relative h-[200px] m-0.5 rounded-t-3xl overflow-hidden">
        {post.metadata.featuredImage ? (
          <Image
            className="object-cover"
            src={post.metadata.featuredImage}
            fill
            sizes="(max-width: 768px) 100vw, 385px"
            alt="blog banner image"
            priority={priority}
          />
        ) : (
          <Image
            className="object-cover"
            src={`/news/${post.year}/${post.month}/${post.slug}/opengraph-image`}
            fill
            sizes="(max-width: 768px) 100vw, 385px"
            alt="blog banner image"
            priority={priority}
          />
        )}
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3
          className="text-[24px] font-semibold leading-normal line-clamp-3 mb-2"
          title={title}
        >
          {truncateText(title, 90)}
        </h3>

        <div className="flex justify-between py-2">
          <h3 className="flex flex-col gap-1 tab-button-text text-white">
            <span>{date}</span>
            {authorName && (
              <span className="text-sm text-pink-500">
                {authorName}
              </span>
            )}
          </h3>
        </div>

        <div className="flex-grow mb-4">
          <p className="line-clamp-4 text-base text-gray-200">
            {truncateText(description, 250)}
          </p>
        </div>

        <div className="mt-auto">
          {isExternalLink ? (
            <a
              href={
                typeof post.slug === "string" ? sanitizeString(post.slug) : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="rounded-2xl bg-transparent gradient-border border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[160px] h-[48px] block">
                Read More
              </button>
            </a>
          ) : (
            <Link
              href={{
                pathname: `/news/${sanitizeString(post.year)}/${sanitizeString(post.month)}/${sanitizeString(post.slug)}`,
              }}
            >
              <button className="rounded-2xl bg-transparent gradient-border border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[160px] h-[48px] block">
                Read More
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
