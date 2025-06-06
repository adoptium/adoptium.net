import React from 'react';
import { notFound } from 'next/navigation';
import { getNewsByTag } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';

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
    return (
        <div>
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
