import React from "react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getNews } from "@/utils/news";
import LatestNewsSlider from "./LatestNewsSlider";
import AnimatedNewsGrid from "./AnimatedNewsGrid";

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
  const t = await getTranslations("LatestNews");
  const { posts } = await getNews({ numPosts: 4 });

  return (
    <>
      <div className="bg-purple py-16 lg:pt-32 pb-0 lg:pb-16 xl:px-0 lg:px-8 px-0">
        <div className="mx-auto max-w-[1264px] w-full flex lg:flex-row flex-col items-start lg:items-center justify-center lg:space-x-8 xl:space-x-16 relative overflow-hidden">
          <div className="max-w-[436px] w-full mb-16 lg:mb-0 px-6">
            <h2 className="here text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
              {t("latest-news-and-updates")}
            </h2>
            <h3 className="text-xl font-normal leading-7 text-grey mt-6 mb-8">
              {t("subtitle")}
            </h3>
            <Link href="/news">
              <button className="rounded-2xl bg-transparent gradient-border border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[154px] h-[48px] block">
                {t("see-all-news")}
              </button>
            </Link>
          </div>

          <AnimatedNewsGrid posts={posts} />

          <div className="w-full flex relative lg:hidden">
            <LatestNewsSlider posts={posts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestNews;
