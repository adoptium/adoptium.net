import React from 'react';
import { Metadata } from 'next';
import { getNews } from '@/utils/news'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest news and updates from the Eclipse Adoptium Project",
}


export default function NewsPage() {
    const { posts, totalPages } = getNews({ numPosts: 6, page: 1 });
    if (!posts || posts.length === 0) {
        return <div>No news articles available.</div>;
    }
    return (
        <div>
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
