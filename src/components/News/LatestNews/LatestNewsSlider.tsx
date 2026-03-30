"use client";

import React, { useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { formatDate } from "@/utils/date";
import { PinkIcon } from "@/components/Common/Icon";

// Define Post type for consistent typing across components
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

interface LatestNewsSliderProps {
  posts: Post[];
}

const LatestNewsSlider = ({ posts }: LatestNewsSliderProps) => {
  const locale = useLocale();
  const swiperRef = useRef<SwiperRef>(null);

  // Duplicate posts to ensure smooth looping if we have few posts
  const displayPosts =
    posts.length > 0 && posts.length < 6 ? [...posts, ...posts] : posts;
  const shouldLoop = displayPosts.length > 2;

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="w-full relative pb-2">
      <Swiper
        modules={[Navigation]}
        ref={swiperRef}
        slidesPerView={1.15}
        centeredSlides={true}
        spaceBetween={20}
        loop={shouldLoop}
        className="!overflow-visible px-4"
        breakpoints={{
          640: {
            slidesPerView: 2.2,
            centeredSlides: false,
            spaceBetween: 24,
          },
        }}
      >
        {displayPosts.map((card, index) => (
          <SwiperSlide className="!h-auto" key={index}>
            <div className="h-full flex flex-col bg-[#1b0e3c] rounded-2xl border border-white/10 p-6 shadow-xl transition-all duration-300 active:scale-[0.98]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PinkIcon />
                  <span className="text-pink text-xs font-bold uppercase tracking-wider">
                    News
                  </span>
                </div>
                <span className="text-gray-400 text-xs font-medium bg-white/5 px-2 py-1 rounded-md">
                  {formatDate(card.metadata.date, locale)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-7 min-h-[3.5rem]">
                {card.metadata.title}
              </h3>

              <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                {card.metadata.description}
              </p>

              <Link
                href={`/news/${card.year}/${card.month}/${card.slug}`}
                className="inline-flex items-center text-white font-bold text-sm group mt-auto w-fit hover:text-pink transition-colors"
              >
                Read Article
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 text-pink"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex gap-6 items-center justify-center mt-6">
        <button
          onClick={handlePrev}
          className="group p-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-pink hover:border-pink transition-all duration-300 active:scale-90 shadow-lg"
          aria-label="Previous News"
        >
          <FiArrowLeftCircle
            size={24}
            className="group-hover:text-white transition-colors"
          />
        </button>
        <button
          onClick={handleNext}
          className="group p-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-pink hover:border-pink transition-all duration-300 active:scale-90 shadow-lg"
          aria-label="Next News"
        >
          <FiArrowRightCircle
            size={24}
            className="group-hover:text-white transition-colors"
          />
        </button>
      </div>
    </div>
  );
};

export default LatestNewsSlider;
