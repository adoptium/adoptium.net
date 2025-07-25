import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getNewsByTag } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';
import { sanitizeObject } from '@/utils/sanitize';
import type { CollectionPage, WithContext } from 'schema-dts';
import { metadata } from '@/utils/metadata';

export async function generateMetadata(
    { params }: {
        params: Promise<{
            tag: string,
            page: string
        }>
    }
) {
    const { tag, page } = await params;
    const pageNumber = parseInt(page, 10);
    return {
        title: `News with tag: ${tag} - Page ${pageNumber}`,
        description: `News and updates from Eclipse Adoptium Project tagged with ${tag}`,
    };
}

export default async function TaggedNewsPage(
    { params }: {
        params: Promise<{
            tag: string,
            page: string
        }>
    }
) {
    const { tag, page } = await params;

    if (page === '1') {
        redirect(`/news/tag/${tag}`);
    }

    const pageNumber = parseInt(page, 10);
    const { posts, totalPages } = getNewsByTag(tag, { numPosts: 6, page: pageNumber });
    if (!posts || posts.length === 0) {
        notFound();
    }

    const jsonLdSchema: WithContext<CollectionPage> = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${metadata.siteUrl}/news/tag/${tag}/page/${pageNumber}`,
        name: `Posts tagged with "${tag}" - Page ${pageNumber}`,
        url: `${metadata.siteUrl}/news/tag/${tag}/page/${pageNumber}`,
        isPartOf: {
            '@type': 'CollectionPage',
            '@id': `${metadata.siteUrl}/news/tag/${tag}`,
        },
        mainEntity: posts.map(post => ({
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            url: `${metadata.siteUrl}/news/${post.year}/${post.month}/${post.slug}`,
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
                title={`News tagged with "${tag}"`}
                description="Follow the latest updates from the Eclipse Adoptium Project"
                className="mx-auto max-w-[860px] px-2 w-full"
            />
            <NewsCardList
                posts={posts}
                previousPageNumber={pageNumber > 1 ? pageNumber - 1 : null}
                previousPageLink={pageNumber > 2 ? `/news/tag/${tag}/page/${pageNumber - 1}` : `/news/tag/${tag}`}
                nextPage={pageNumber < totalPages ? `/news/tag/${tag}/page/${pageNumber + 1}` : ''}
                currentPage={pageNumber}
                totalPages={totalPages}
                baseUrl={`/news/tag/${tag}`}
            />
        </div>
    )
}
