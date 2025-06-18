import React from "react"
import { Link } from "@/i18n/navigation"
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
    if (isEvents) {
        return (
            <article>
                {posts.map((event, index) => {
                    const eventItem = event as Events;
                    return (
                        <div key={index}>
                            <a href={eventItem.infoLink} target="_blank" rel="noreferrer">
                                <div className="text-[#c4bfce]">
                                    <p className="text-[12px] leading-[133.333%] text-lightgrey mb-0">
                                        {new Date(eventItem.date).toLocaleDateString(locale, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>

                                    <h3 className="text-[20px] leading-[140%] text-white mb-4">
                                        {eventItem.title}
                                    </h3>
                                    {eventItem.description && (
                                        <p className="tab-button-text text-sm text-lightgrey pt-2">
                                            {eventItem.description.length > 150 ? `${eventItem.description.substring(0, 150)}...` : eventItem.description}
                                        </p>
                                    )}
                                </div>
                            </a>
                            <span className="h-[1px] w-full bg-[#3E3355] inline-block my-4"></span>
                        </div>
                    );
                })}
            </article>
        );
    }

    return (
        <article>
            {(posts as NewsPost[]).map((post, index) => {
                // EF news posts have a 'newsItem' property and external link
                const isEF = !!post.newsItem;
                const link = isEF
                    ? post.slug // external link
                    : `/news/${post.year}/${post.month}/${post.slug}`;
                const title = isEF ? post.metadata.title : post.metadata.title;
                const description = isEF ? post.metadata.description : post.metadata.description;
                const date = isEF ? post.metadata.date : post.metadata.date;
                return (
                    <div key={index}>
                        {isEF ? (
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                <div className="text-[#c4bfce]">
                                    <p className="text-[12px] leading-[133.333%] text-lightgrey mb-0">
                                        {(() => {
                                            const daysAgo = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
                                            if (daysAgo < 7) {
                                                return daysAgo === 1 ? `1 day ago` : `${daysAgo} days ago`;
                                            } else {
                                                const weeksAgo = Math.floor(daysAgo / 7);
                                                return weeksAgo === 1 ? `1 week ago` : `${weeksAgo} weeks ago`;
                                            }
                                        })()}
                                    </p>
                                    <h3 className="text-[20px] leading-[140%] text-white mb-4">
                                        {title}
                                    </h3>
                                    <p className="tab-button-text text-sm text-lightgrey pt-2">
                                        {description}
                                    </p>
                                </div>
                            </a>
                        ) : (
                            <Link href={link}>
                                <div className="text-[#c4bfce]">
                                    <p className="text-[12px] leading-[133.333%] text-lightgrey mb-0">
                                        {(() => {
                                            const daysAgo = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
                                            if (daysAgo < 7) {
                                                return daysAgo === 1 ? `1 day ago` : `${daysAgo} days ago`;
                                            } else {
                                                const weeksAgo = Math.floor(daysAgo / 7);
                                                return weeksAgo === 1 ? `1 week ago` : `${weeksAgo} weeks ago`;
                                            }
                                        })()}
                                    </p>
                                    <h3 className="text-[20px] leading-[140%] text-white mb-4">
                                        {title}
                                    </h3>
                                    <p className="tab-button-text text-sm text-lightgrey pt-2">
                                        {description}
                                    </p>
                                </div>
                            </Link>
                        )}
                        <span className="h-[1px] w-full bg-[#3E3355] inline-block my-4"></span>
                    </div>
                );
            })}
        </article>
    )
}

export default TabContent
