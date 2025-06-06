import React from "react";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/News/Pagination";

interface NewsCardListProps {
  posts: Array<{
    slug: string;
    year: string;
    month: string;
    metadata: {
      title: string;
      description: string;
      date: string;
      featuredImage?: string;
      tags?: string[];
    }
  }>;
  previousPageNumber: number | null;
  previousPageLink: string | null;
  nextPage: string;
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const NewsCardList: React.FC<NewsCardListProps> = ({
  posts,
  previousPageNumber,
  previousPageLink,
  nextPage,
  currentPage,
  totalPages,
  baseUrl,
}) => {
  const data1 = posts.slice(0, 3);
  const data2 = posts.slice(3, 6);

  return (
    <div className="max-w-[1264px] mx-auto px-6 py-8 md:pt-12">
      <div className="flex justify-center gap-6 items-center flex-wrap pt-8 md:pt-12">
        {data1.map((post, index) => (
          <EventCard key={index} post={post} />
        ))}
      </div>
      <div className="flex justify-center gap-6 items-center flex-wrap py-8 md:py-12">
        {data2.map((post, index) => (
          <EventCard key={index} post={post} />
        ))}
      </div>
      <Pagination
        previousPageNumber={previousPageNumber}
        previousPageLink={previousPageLink}
        nextPage={nextPage}
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
      />
      <div className="flex justify-center items-center gap-5 mt-8">
        <a 
          href="https://newsroom.eclipse.org/node/add/news" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-full transition-all duration-200 ease-in-out text-center font-medium">Submit News</a>
      </div>
    </div>
  );
};

export default NewsCardList;
