"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import { shuffle } from "../../utils/shuffle";
import { PinkIcon } from "../Common/Icon";

type BannerProps = {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  startDate?: string;
  endDate?: string;
  releaseBanner?: boolean;
};

// -------------------------------------------------------
// NOTE: Add your list of current banners here
// -------------------------------------------------------
const currentBanners: BannerProps[] = [
  {
    title: "October 2025 PSU Binaries - In Progress",
    description: "We are creating the October 2025 PSU binaries for Eclipse Temurin 8u472, 11.0.29 and 17.0.17 and 21.0.9 and 25.0.1",
    cta: "View Progress by Platform",
    ctaLink: "https://github.com/adoptium/temurin/issues/100",
    startDate: "2025-10-21T00:00:00Z", // Release banner 2 week period
    endDate:   "2025-11-04T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "Case Study: Bloomberg’s shift to Open Source Java",
    description:
      "Discover how Eclipse Temurin helps power global financial infrastructure.",
    cta: "Read the Case Study",
    ctaLink:
      "https://outreach.eclipse.foundation/bloomberg-temurin-case-study?utm_campaign=22235449-Bloomberg%20Adoptium%20Case%20Study&utm_source=banner&utm_medium=adoptium%20website",
    startDate: "2025-09-30T23:59:59Z",
    endDate: "2025-11-15T23:59:59Z",
  },
];

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [banner, setBanner] = useState<BannerProps | null>(null);

  // Track when component mounts to prevent hydration issues
  useEffect(() => {
    const now = new Date();

    // Filter banners based on current date and validity
    const filteredBanners = currentBanners
      .filter((banner) => (banner.startDate ? now >= new Date(banner.startDate) : true) && (banner.endDate ? now <= new Date(banner.endDate) : true));
    const releaseBanners = currentBanners
      .filter(banner => ((banner.releaseBanner ? banner.releaseBanner : false) && (banner.startDate ? now >= new Date(banner.startDate) : true) && (banner.endDate ? now <= new Date(banner.endDate) : true)));

    // Prioritize a Release banner
    if (releaseBanners.length > 0) {
      // There is a Release banner within the current date
      setBanner(releaseBanners[0]);
    } else {
      // randomly select one banner if multiple are valid
      setBanner(filteredBanners.length > 0 ? shuffle(filteredBanners)[0] : null);
    }
    setIsMounted(true);
  }, []);

  // Handle banner dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for fade out animation to complete before removing from DOM
    setTimeout(() => {
      setIsDismissed(true);
    }, 700);
  };

  // Don't render if dismissed
  if (isDismissed) {
    return null;
  }

  // Don't render if no valid banner
  if (!banner) {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-r from-[#0E002A] via-[#240b50] to-[#9a227a] py-5 w-full shadow-lg transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center relative">
          {/* Close button - only show after mount to prevent hydration issues */}
          {isMounted && (
            <button
              onClick={handleDismiss}
              className="absolute top-0 right-0 md:top-[-8px] md:right-[-8px] p-2 text-gray-300 hover:text-white transition-colors duration-200 group"
              aria-label="Dismiss banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <div
            className={`flex items-center gap-4 mb-3 md:mb-0 ${
              isMounted ? "pr-8" : ""
            }`}
          >
            {/* Only add padding after mount */}
            <div className="transform hover:scale-110 transition-transform duration-300">
              <PinkIcon />
            </div>
            <div>
              <h2 className="text-[16px] md:text-[18px] font-extrabold text-white leading-tight">
                <span className="text-primary">{banner.title}</span>
              </h2>
              <p className="text-[14px] text-gray-200 mt-1 max-w-2xl">
                {banner.description}
              </p>
            </div>
          </div>
          <div className="mt-2 md:mt-0">
            <a
              href={banner.ctaLink}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl inline-flex items-center group"
            >
              {banner.cta}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
