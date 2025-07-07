import React from 'react';
import { notFound } from 'next/navigation';
import { getNewsByTag } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';
import { sanitizeObject } from '@/utils/sanitize';
import type { CollectionPage, WithContext } from 'schema-dts'
import { metadata } from '@/utils/metadata';

export async function generateMetadata(
    { params }: {
        params: Promise<{
            tag: string
        }>
    }
) {
    const { tag } = await params;
    return {
        title: `News with tag: ${tag}`,
        description: `News and updates from Eclipse Adoptium Project tagged with ${tag}`,
    };
}


export default async function TagsPage(
    { params }: {
        params: Promise<{
            tag: string
        }>
    }
) {
    const { tag } = await params;
    const { posts, totalPages } = getNewsByTag(tag, { numPosts: 6, page: 1 });
    if (!posts || posts.length === 0) {
        notFound();
    }

    const jsonLdSchema: WithContext<CollectionPage> = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${metadata.siteUrl}/news/tag/${tag}`,
        name: `Posts tagged with "${tag}"`,
        url: `${metadata.siteUrl}/news/tag/${tag}`,
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
                previousPageNumber={null}
                previousPageLink={null}
                nextPage={totalPages > 1 ? `/news/tag/${tag}/page/2` : ''}
                currentPage={1}
                totalPages={totalPages}
                baseUrl={`/news/tag/${tag}`}
            />
        </div>
    )
}
