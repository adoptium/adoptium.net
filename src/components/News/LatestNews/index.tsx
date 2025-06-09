import React from "react"
import Link from "next/link"
import { getNews } from "@/utils/news"
import { formatDate } from '@/utils/date'
import LatestNewsSlider from "./LatestNewsSlider"
import { PinkIcon } from "@/components/Common/Icon"

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
  };
  author?: string;
  tags?: string[];
};

const LatestNews = async () => {
  const { posts } = await getNews({ numPosts: 4 });
  const set1 = posts.slice(0, 2);
  const set2 = posts.slice(2, 4);

  const NewsCard: React.FC<{ card: Post }> = ({ card }) => (
    <div className="bg-white/5 rounded-3xl border border-white/50 backdrop-blur-xl p-8 xl:p-10">
      <h2 className="text-primary text-lg leading-6 font-bold m-0 flex items-center gap-x-3">
        <PinkIcon />
        News
      </h2>
      <p className="text-white text-lg xl:text-xl font-normal leading-6 xl:leading-7 my-2">
        {card.metadata.title}
      </p>
      <span className="text-sm text-grey font-normal leading-5 block">
        {formatDate(card.metadata.date)}
      </span>
      <Link
        href={`/news/${card.year}/${card.month}/${card.slug}`}
        className="py-3 text-base underline font-bold leading-6 text-white mt-2 block border-white w-fit"
      >
        Read More
      </Link>
    </div>
  )

  return (
    <>
      <div className="bg-purple py-16 lg:pt-32 pb-16 xl:px-0 lg:px-8 px-0">
        <div className="mx-auto max-w-[1264px] w-full flex lg:flex-row flex-col items-start lg:items-center justify-center lg:space-x-8 xl:space-x-16 relative overflow-hidden">
          <div className="max-w-[436px] w-full mb-16 lg:mb-0 px-6">
            <h2 className="here text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
              Latest news and updates
            </h2>
            <h3 className="text-xl font-normal leading-7 text-grey mt-6 mb-8">
              Follow the latest updates from the Eclipse Adoptium Project
            </h3>
            <Link href="/news">
              <button className="rounded-2xl bg-transparent gradient-border border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[154px] h-[48px] block">
                See all news
              </button>
            </Link>
          </div>
          <div className="max-w-[780px] w-full lg:flex gap-4 xl:gap-x-8 hidden">
            {/* First set of news items */}
            <div className="max-w-[374px] w-full lg:flex hidden flex-col space-y-4 xl:space-y-8">
              {set1.map((card, index) => (
                <NewsCard key={index} card={card} />
              ))}
            </div>
            {/* Second set of news items */}
            <div className="max-w-[374px] w-full lg:flex hidden flex-col space-y-4 xl:space-y-8 mt-16">
              {set2.map((card, index) => (
                <NewsCard key={index} card={card} />
              ))}
            </div>
          </div>
          <div className="w-full flex relative lg:hidden">
            <LatestNewsSlider posts={posts} />
          </div>
        </div>
      </div>
    </>
  )
}

export default LatestNews
