"use client"

import React, { useRef, useEffect } from "react"
import { useLocale } from 'next-intl'
import { Link } from "@/i18n/navigation"
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react"
import SwiperCore from "swiper"
import { Navigation } from "swiper/modules"
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi"
import { formatDate } from '@/utils/date'
import { PinkIcon } from "@/components/Common/Icon"

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
  const locale = useLocale()
  SwiperCore.use([Navigation])
  const swiperRef = useRef<SwiperRef>(null)

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.init()
    }
  }, [])

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  return (
    <div className="overflow-hidden pl-6 max-w-full relative">
      <Swiper
        ref={swiperRef}
        slidesPerView="auto"
        spaceBetween={16}
        loop={true}
        className="mySwiper lg:hidden"
      >
        {posts.map((card, index) => (
          <SwiperSlide
            className={`!w-[256px] bg-white/5 rounded-3xl border border-white/50 backdrop-blur-xl p-6 m-auto`}
            key={index}
          >
            <h2 className="text-primary text-base leading-6 font-bold m-0 flex items-center gap-x-3">
              <PinkIcon />
              News
            </h2>
            <p className="text-white text-xl  font-normal leading-7 mt-6">
              {card.metadata.title}
            </p>
            <span className="text-sm text-grey font-normal leading-5 block mt-2 mb-6">
              {formatDate(card.metadata.date, locale)}
            </span>
            <Link
              href={`/news/${card.year}/${card.month}/${card.slug}`}
              className="py-3 text-base underline font-bold leading-6 text-white mt-2 block border-white w-fit"
            >
              Read More
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex gap-4 items-center justify-center mt-16 mb-8">
        <button
          onClick={handlePrev}
          className="text-white"
          aria-label="Previous News"
          data-testid="prev-news-button"
        >
          <FiArrowLeftCircle size={50} strokeWidth={1} />
        </button>
        <button
          onClick={handleNext}
          className="text-white"
          aria-label="Next News"
          data-testid="next-news-button"
        >
          <FiArrowRightCircle size={50} strokeWidth={1} />
        </button>
      </div>
    </div>
  )
}

export default LatestNewsSlider
