import React from 'react';
import { notFound, redirect } from 'next/navigation'
import { getNewsByAuthor } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';
import AuthorBio from '@/components/News/AuthorBio';
import { getFormattedAuthorData } from '@/utils/authors';
import { Person, CollectionPage, Graph } from 'schema-dts';
import { sanitizeObject } from '@/utils/sanitize';
import { metadata } from '@/utils/metadata'

export async function generateMetadata(
    { params }: {
        params: Promise<{
            author: string,
            page: string
        }>
    }
) {
    const { author, page } = await params;
    const pageNumber = parseInt(page, 10);
    const authorData = getFormattedAuthorData(author);

    return {
        title: `${authorData.name} - Page ${pageNumber}`,
        description: `News and updates from Eclipse Adoptium Project authored by ${authorData.name}`,
    };
}

export default async function AuthorNewsPagePaginated(
    { params }: {
        params: Promise<{
            author: string,
            page: string
        }>
    }
) {
    const { author, page } = await params;

    if (page === '1') {
        redirect(`/news/author/${author}`);
    }

    const pageNumber = parseInt(page, 10);
    const authorData = getFormattedAuthorData(author);

    const { posts, totalPages } = getNewsByAuthor(author, { numPosts: 6, page: pageNumber });
    if (!posts || posts.length === 0) {
        notFound();
    }

    const socialLinks = [];
    if (authorData.twitter) socialLinks.push(`https://x.com/${authorData.twitter}`);
    if (authorData.github) socialLinks.push(`https://github.com/${authorData.github}`);
    if (authorData.linkedin) socialLinks.push(`https://www.linkedin.com/in/${authorData.linkedin}`);

    const personSchema: Person = {
        '@type': 'Person',
        name: authorData.name || 'Unknown Author',
        affiliation: {
            '@type': 'Organization',
            name: 'Eclipse Adoptium',
        },
        url: `${metadata.siteUrl}/news/author/${author}`,
        ...(socialLinks.length > 0 && { sameAs: socialLinks }),
    };

    const collectionPageSchema: CollectionPage = {
        '@type': 'CollectionPage',
        '@id': `${metadata.siteUrl}/news/author/${author}/page/${pageNumber}`,
        name: `Posts by ${authorData.name || 'Unknown Author'} - Page ${pageNumber}`,
        url: `${metadata.siteUrl}/news/author/${author}/page/${pageNumber}`,
        isPartOf: {
            "@type": "CollectionPage",
            '@id': `${metadata.siteUrl}/news/author/${author}`,
        },
        mainEntity: posts.map(post => ({
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            url: `${metadata.siteUrl}/news/${post.year}/${post.month}/${post.slug}`,
            datePublished: new Date(post.metadata.date).toISOString(),
        })),
    };

    const jsonLdSchema: Graph = {
        '@context': 'https://schema.org',
        '@graph': [personSchema, collectionPageSchema],
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
                previousPageNumber={pageNumber > 1 ? pageNumber - 1 : null}
                previousPageLink={pageNumber > 2 ? `/news/author/${author}/page/${pageNumber - 1}` : `/news/author/${author}`}
                nextPage={pageNumber < totalPages ? `/news/author/${author}/page/${pageNumber + 1}` : ''}
                currentPage={pageNumber}
                totalPages={totalPages}
                baseUrl={`/news/author/${author}`}
            />
        </div>
    )
}
