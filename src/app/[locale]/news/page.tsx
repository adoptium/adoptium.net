import React from 'react';
import { getBlogPosts } from '@/utils/markdown'
import PageHeader from '@/components/Common/PageHeader';
import NewsCardList from '@/components/News/NewsCardList';


export default function NewsPage() {
    const posts = getBlogPosts();
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
                previousPageNumber={1}
                previousPageLink={'/news/page/1'}
                nextPage={'/news/page/2'}
                currentPage={1}
                totalPages={3}
                baseUrl={'/news'}
            />
        </div>
    )
}
