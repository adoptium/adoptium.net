import React from "react";
import EventCard from "@/components/Events/EventCard";
import Pagination from "@/components/News/Pagination";

type Post = {
  slug: string;
  year: string;
  month: string;
  metadata: {
    title: string;
    description: string;
    date: string;
    featuredImage?: string;
    tags?: string[];
    author?: string;
  };
};

interface NewsCardListProps {
  posts: Array<Post>;
  previousPageNumber: number | null;
  previousPageLink: string | null;
  nextPage: string;
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryString?: string;
}

const NewsCardList: React.FC<NewsCardListProps> = ({
  posts,
  previousPageNumber,
  previousPageLink,
  nextPage,
  currentPage,
  totalPages,
  baseUrl,
  queryString,
}) => {
  const allPosts = [...posts];
  const rowsNeeded = Math.ceil(allPosts.length / 3);
  const rowData: Post[][] = [];

  // Create rows with up to 3 cards each
  for (let i = 0; i < rowsNeeded; i++) {
    const startIndex = i * 3;
    const rowPosts = allPosts.slice(startIndex, startIndex + 3);
    rowData.push(rowPosts);
  }

  return (
    <div className="max-w-[1264px] mx-auto px-6">
      {/* Display all posts in rows of up to 3 cards */}
      {rowData.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-4 md:py-6"
        >
          {row.map((post, index) => (
            <EventCard
              key={`post-${rowIndex}-${index}`}
              post={post}
              isEclipseNews={post.metadata.tags?.includes("eclipse-news")}
              priority={rowIndex === 0}
            />
          ))}
        </div>
      ))}
      <Pagination
        previousPageNumber={previousPageNumber}
        previousPageLink={previousPageLink}
        nextPage={nextPage}
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
        queryString={queryString}
      />
      <div className="flex justify-center items-center gap-5 mt-12">
        <a
          href="https://newsroom.eclipse.org/node/add/news"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-pink hover:bg-rose-700 text-white py-3 px-8 rounded-xl transition-colors duration-200 text-sm font-semibold shadow-lg shadow-pink/20"
        >
          Submit News
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NewsCardList;
