import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getNews } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';
import { sanitizeObject } from '@/utils/sanitize';
import { metadata as siteMetadata } from '@/utils/metadata';

export async function generateMetadata(
    { params }: {
        params: Promise<{
            page: string;
        }>
    }
) {
    const { page } = await params;
    const pageNumber = parseInt(page, 10);
    return {
        title: `News & Updates - Page ${pageNumber}`,
        description: "Latest news and updates from the Eclipse Adoptium Project",
    };
}

export default async function NewsPage(
    { params }: {
        params: Promise<{
            page: string;
        }>
    }
) {
    const { page } = await params;

    if (page === '1') {
        redirect('/news');
    }

    const pageNumber = parseInt(page, 10);
    const { posts, totalPages } = await getNews({ numPosts: 9, page: pageNumber, includeEF: true });
    if (!posts || posts.length === 0) {
        notFound();
    }

    const jsonLdSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteMetadata.siteUrl}/news/page/${pageNumber}`,
        name: 'Eclipse Adoptium News & Updates',
        url: `${siteMetadata.siteUrl}/news/page/${pageNumber}`,
        isPartOf: {
            '@type': 'CollectionPage',
            '@id': `${siteMetadata.siteUrl}/news`,
        },
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
                previousPageNumber={pageNumber > 1 ? pageNumber - 1 : null}
                previousPageLink={pageNumber > 2 ? `/news/page/${pageNumber - 1}` : '/news'}
                nextPage={pageNumber < totalPages ? `/news/page/${pageNumber + 1}` : ''}
                currentPage={pageNumber}
                totalPages={totalPages}
                baseUrl={'/news'}
            />
        </div>
    )
}
