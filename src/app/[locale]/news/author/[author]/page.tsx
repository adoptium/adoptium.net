import React from 'react';
import { notFound } from 'next/navigation'
import { getNewsByAuthor } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';
import AuthorBio from '@/components/News/AuthorBio';
import { getFormattedAuthorData } from '@/utils/authors';
import { sanitizeObject } from '@/utils/sanitize';
import { metadata } from '@/utils/metadata'

export async function generateMetadata(
    { params }: {
        params: Promise<{
            author: string
        }>
    }
) {
    const { author } = await params;
    const authorData = getFormattedAuthorData(author);
    return {
        title: authorData.name || `News by Author`,
        description: `News and updates from Eclipse Adoptium Project authored by ${authorData.name}`,
    };
}

export default async function AuthorNewsPage(
    { params }: {
        params: Promise<{
            author: string
        }>
    }
) {
    const { author } = await params;
    const authorData = getFormattedAuthorData(author);

    const { posts, totalPages } = getNewsByAuthor(author, { numPosts: 6, page: 1 });
    if (!posts || posts.length === 0) {
        notFound();
    }

    const socialLinks = [];
    if (authorData.twitter) socialLinks.push(`https://x.com/${authorData.twitter}`);
    if (authorData.github) socialLinks.push(`https://github.com/${authorData.github}`);
    if (authorData.linkedin) socialLinks.push(`https://www.linkedin.com/in/${authorData.linkedin}`);

    const jsonLdSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                name: authorData.name || 'Unknown Author',
                affiliation: {
                    '@type': 'Organization',
                    name: 'Eclipse Adoptium',
                },
                url: `${metadata.siteUrl}/news/author/${author}`,
                ...(socialLinks.length > 0 && { sameAs: socialLinks }),
            },
            {
                '@type': 'CollectionPage',
                '@id': `${metadata.siteUrl}/news/author/${author}`,
                name: `Posts by ${authorData.name || 'Unknown Author'}`,
                url: `${metadata.siteUrl}/news/author/${author}`,
                mainEntity: posts.map(post => ({
                    '@type': 'BlogPosting',
                    headline: post.metadata.title,
                    url: `${metadata.siteUrl}/news/${post.year}/${post.month}/${post.slug}`,
                    datePublished: new Date(post.metadata.date).toISOString(),
                })),
            }
        ]
    }

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
                subtitle="Author"
                title={authorData.name || `News by Author`}
                description={<AuthorBio author={authorData} identifier={author} />}
                className="mx-auto max-w-[860px] px-2 w-full"
            />
            <NewsCardList
                posts={posts}
                previousPageNumber={null}
                previousPageLink={null}
                nextPage={1 < totalPages ? `/news/author/${author}/page/${1 + 1}` : ''}
                currentPage={1}
                totalPages={totalPages}
                baseUrl={`/news/author/${author}`}
            />
        </div>
    )
}
