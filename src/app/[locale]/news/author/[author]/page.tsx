import React from 'react';
import { notFound } from 'next/navigation'
import { getNewsByAuthor } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';
import AuthorBio from '@/components/News/AuthorBio';
import { getFormattedAuthorData } from '@/utils/authors';

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

    return (
        <div>
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
