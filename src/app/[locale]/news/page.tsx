import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation'
import { getNews } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';
import { sanitizeObject } from '@/utils/sanitize';
import type { CollectionPage, WithContext } from 'schema-dts'
import { metadata as siteMetadata } from '@/utils/metadata';

export const metadata: Metadata = {
    title: "News & Updates",
    description: "Latest news and updates from the Eclipse Adoptium Project",
}

export default async function NewsPage() {
    const { posts, totalPages } = await getNews({ numPosts: 9, page: 1, includeEF: true });
    if (!posts || posts.length === 0) {
        notFound();
    }

    const jsonLdSchema: WithContext<CollectionPage> = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteMetadata.siteUrl}/news`,
        name: 'Eclipse Adoptium News & Updates',
        url: `${siteMetadata.siteUrl}/news`,
        mainEntity: posts.map(post => ({
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            url: `${siteMetadata.siteUrl}/news/${post.year}/${post.month}/${post.slug}`,
            datePublished: new Date(post.metadata.date).toISOString(),
        })),
    };

    const sanitizedJsonLd = sanitizeObject(jsonLdSchema);

    return (
        <div>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(sanitizedJsonLd),
                }}
            />
            <PageHeader
                subtitle="News"
                title="News & Updates"
                description="Follow the latest updates from the Eclipse Adoptium Project"
                className="mx-auto max-w-[860px] px-2 w-full"
            />
            <NewsCardList
                posts={posts}
                previousPageNumber={null}
                previousPageLink={null}
                nextPage={totalPages > 1 ? '/news/page/2' : ''}
                currentPage={1}
                totalPages={totalPages}
                baseUrl={'/news'}
            />
        </div>
    )
}
