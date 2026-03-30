import React from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

type NewsPost = {
  slug: string;
  year: string | number;
  month: string | number;
  newsItem?: unknown;
  metadata: {
    title: string;
    description: string;
    date: string;
  };
};

type Events = {
  title: string;
  date: string;
  description?: string;
  infoLink: string;
};

interface TabContentProps {
  posts: NewsPost[] | Events[];
  isEvents?: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ posts, isEvents = false }) => {
  const locale = useLocale();

  const formatTimeAgo = (date: string): string => {
    const daysAgo = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (true) {
      case daysAgo === 0:
        return "Today";
      case daysAgo === 1:
        return "1 day ago";
      case daysAgo < 7:
        return `${daysAgo} days ago`;
      case daysAgo < 14:
        return "1 week ago";
      default:
        const weeksAgo = Math.floor(daysAgo / 7);
        return `${weeksAgo} weeks ago`;
    }
  };
  if (isEvents) {
    return (
      <div className="flex flex-col gap-4">
        {posts.map((event, index) => {
          const eventItem = event as Events;
          return (
            <a
              key={index}
              href={eventItem.infoLink}
              target="_blank"
              rel="noreferrer"
              className="group block p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-pink uppercase tracking-wider">
                  {new Date(eventItem.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>

                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-pink transition-colors duration-200">
                  {eventItem.title}
                </h3>
                {eventItem.description && (
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {eventItem.description}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {(posts as NewsPost[]).map((post, index) => {
        // EF news posts have a 'newsItem' property and external link
        const isEF = !!post.newsItem;
        const link = isEF
          ? post.slug // external link
          : `/news/${post.year}/${post.month}/${post.slug}`;
        const title = isEF ? post.metadata.title : post.metadata.title;
        const description = isEF
          ? post.metadata.description
          : post.metadata.description;
        const date = isEF ? post.metadata.date : post.metadata.date;

        const Content = () => (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-pink uppercase tracking-wider">
              {formatTimeAgo(date)}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug group-hover:text-pink transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        );

        const cardClasses =
          "group block p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5";

        return (
          <div key={index}>
            {isEF ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClasses}
              >
                <Content />
              </a>
            ) : (
              <Link href={link} className={cardClasses}>
                <Content />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabContent;
