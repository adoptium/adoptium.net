import React from "react"
import { useLocale } from 'next-intl'
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { formatDate } from '@/utils/date'
import { sanitizeString } from "@/utils/sanitize"

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
        }
    }
    isEclipseNews?: boolean;
}

const EventCard = ({ post, isEclipseNews }: EventCardProps) => {
    const locale = useLocale()
    // Check if this is an external link (Eclipse Foundation news)
    const isExternalLink = isEclipseNews ||
        post.metadata.tags?.includes('eclipse-news')

    // Function to truncate text if it exceeds maxLength
    const truncateText = (text: string, maxLength: number): string => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    // Handle potentially missing data
    const title = post.metadata.title || 'Untitled';
    const description = post.metadata.description || '';
    const date = formatDate(post.metadata.date, locale) || '';

    return (
        <div className="flex flex-col max-w-[385px] w-full sm:w-[385px] min-h-[600px] rounded-3xl newscard-2 bg-[#200D46]">
            {post.metadata.featuredImage ? (
                <Image
                    className="m-0.5 rounded-t-3xl h-[200px] object-cover w-full"
                    src={post.metadata.featuredImage}
                    width={385}
                    height={200}
                    alt="blog banner image"
                />
            ) : (
                <Image
                    className="m-0.5 rounded-t-3xl h-[200px] object-cover w-full"
                    src={`/news/${post.year}/${post.month}/${post.slug}/opengraph-image`}
                    width={385}
                    height={200}
                    alt="blog banner image"
                />
            )}

            <div className="p-8 flex flex-col h-[400px]">
                <h3
                    className="text-[24px] font-semibold leading-normal h-auto line-clamp-3 mb-2"
                    title={title}
                >
                    {truncateText(title, 90)}
                </h3>

                <div className="flex justify-between py-2">
                    <h3 className="flex flex-col gap-1 tab-button-text text-white">
                        <span>{date}</span>
                        {post.metadata.tags?.includes('eclipse-news') &&
                            <span className="text-sm text-pink-500">Eclipse Foundation</span>
                        }
                    </h3>
                </div>

                <div className="flex-grow overflow-hidden mb-4">
                    <p className="line-clamp-4 text-base text-gray-200">
                        {truncateText(description, 250)}
                    </p>
                </div>

                <div className="mt-auto">
                    {isExternalLink ? (
                        <a
                            href={sanitizeString(post.slug)}
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
    )
}

export default EventCard