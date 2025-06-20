"use client"

import React, { useEffect, useRef, useMemo } from "react"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react"
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi"
import SwiperCore from "swiper"
import { Navigation } from "swiper/modules"

import "swiper/swiper-bundle.css"
import "./styles.css"

const Features = () => {
  SwiperCore.use([Navigation])
  const t = useTranslations("TemurinFeatures")
  const features = useMemo(() => [
    {
      heading: t("features.secure-supply-chain.title"),
      content: t("features.secure-supply-chain.description"),
      img: "/images/icons/lock.svg"
    },
    {
      heading: t("features.aqavit-verification.title"),
      content: t("features.aqavit-verification.description"),
      img: "/images/initiatives/testing.svg"
    },
    {
      heading: t("features.performance-optimization.title"),
      content: t("features.performance-optimization.description"),
      img: "/images/initiatives/deploy.svg"
    },
    {
      heading: t("features.cross-platform.title"),
      content: t("features.cross-platform.description"),
      img: "/images/initiatives/release.svg"
    },
    {
      heading: t("features.community-driven.title"),
      content: t("features.community-driven.description"),
      img: "/images/initiatives/community.svg"
    },
    {
      heading: t("features.enterprise-ready.title"),
      content: t("features.enterprise-ready.description"),
      img: "/images/initiatives/security.svg"
    }
  ], [t])

  const swiperRef = useRef<SwiperRef>(null)

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update()
    }
  }, [features])

  const handlePrevbase = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNextbase = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  return (
    <div className="temurin-features">
      <div className=" lg:py-14 sm:py-18  mx-auto w-full">
        <div className="mx-auto lg:pl-[88px] pl-6 w-full flex lg:flex-row flex-col items-start lg:items-end justify-center lg:space-x-8 xl:space-x-16 relative overflow-hidden">
          <div className="max-w-[600px] w-full flex flex-col justify-between mb-16 lg:mb-0">
            <div>
              <h2 className="text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
                {t("title")}
              </h2>
              <h3 className="text-xl font-normal leading-7 text-grey mt-6 mb-8">
                {t("description")}
              </h3>
              <Link href="/temurin/releases">
                <button className="bg-transparent mt-10 border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[191px] h-[48px] rounded-2xl gradient-border">
                  Download Temurin™
                </button>
              </Link>
            </div>
            <div className="lg:flex gap-4 items-center mt-16 hidden">
              <button
                onClick={handlePrevbase}
                className="text-white"
                aria-label="Previous Feature"
              >
                <FiArrowLeftCircle size={50} strokeWidth={1} />
              </button>
              <button
                onClick={handleNextbase}
                className="text-white"
                aria-label="Next Feature"
              >
                <FiArrowRightCircle size={50} strokeWidth={1} />
              </button>
            </div>
          </div>
          <Swiper
            loop={true}
            slidesPerView={"auto"}
            className="mySwiperbase w-full"
            breakpoints={{
              320: {
                spaceBetween: 16,
              },
              1024: {
                spaceBetween: 32,
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            ref={swiperRef}
          >
            {features.map((feature, index) => (
              <SwiperSlide
                className="!w-[350px] p-8 lg:p-16 lg:w-[400px] bg-white/5 rounded-3xl border border-white/50 backdrop-blur-xl h-[300px] flex flex-col"
                key={index}
              >
                <div className="flex-shrink-0">
                  <Image
                    src={feature.img}
                    alt={feature.heading}
                    width={64}
                    height={64}
                    className="h-[64px] w-auto"
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow mt-10">
                  <div>
                    <h2 className="text-white text-2xl leading-6 font-bold m-0 flex items-center gap-x-3 mb-4">
                      {feature.heading}
                    </h2>
                    <p className="text-grey text-l font-normal leading-7 mt-6">
                      {feature.content}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>{" "}
          <div className="flex gap-4 items-center my-8  w-full justify-center lg:hidden">
            <button onClick={handlePrevbase} className="text-white">
              <FiArrowLeftCircle
                size={50}
                strokeWidth={1}
                aria-label="Previous Feature"
              />
            </button>
            <button onClick={handleNextbase} className="text-white">
              <FiArrowRightCircle
                size={50}
                strokeWidth={1}
                aria-label="Next Feature"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features