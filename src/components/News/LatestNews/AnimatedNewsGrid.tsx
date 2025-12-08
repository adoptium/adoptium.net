"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/utils/date";
import { PinkIcon } from "@/components/Common/Icon";
import { motion } from "framer-motion";

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

const NewsCard: React.FC<{ card: Post }> = ({ card }) => {
  const t = useTranslations("LatestNews");
  const locale = useLocale();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-white/5 rounded-3xl border border-white/50 backdrop-blur-xl p-8 xl:p-10 hover:bg-white/10 transition-colors duration-300"
    >
      <h2 className="text-primary text-lg leading-6 font-bold m-0 flex items-center gap-x-3">
        <PinkIcon />
        News
      </h2>
      <p className="text-white text-lg xl:text-xl font-normal leading-6 xl:leading-7 my-2">
        {card.metadata.title}
      </p>
      <span className="text-sm text-grey font-normal leading-5 block">
        {formatDate(card.metadata.date, locale)}
      </span>
      <Link
        href={`/news/${card.year}/${card.month}/${card.slug}`}
        className="py-3 text-base underline font-bold leading-6 text-white mt-2 block border-white w-fit hover:text-pink transition-colors"
      >
        {t("read-more")}
      </Link>
    </motion.div>
  );
};

const AnimatedNewsGrid = ({ posts }: { posts: Post[] }) => {
  const set1 = posts.slice(0, 2);
  const set2 = posts.slice(2, 4);

  return (
    <div className="max-w-[780px] w-full lg:flex gap-4 xl:gap-x-8 hidden">
      {/* First set of news items */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.2 }}
        className="max-w-[374px] w-full lg:flex hidden flex-col space-y-4 xl:space-y-8"
      >
        {set1.map((card, index) => (
          <NewsCard key={index} card={card} />
        ))}
      </motion.div>
      {/* Second set of news items */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.2 }}
        className="max-w-[374px] w-full lg:flex hidden flex-col space-y-4 xl:space-y-8 mt-16"
      >
        {set2.map((card, index) => (
          <NewsCard key={index} card={card} />
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedNewsGrid;
