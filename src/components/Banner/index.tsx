"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import { shuffle } from "../../utils/shuffle";
import { PinkIcon } from "../Common/Icon";
import { BannerProps, currentBanners } from "./banners";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [banner, setBanner] = useState<BannerProps | null>(null);

  // Track when component mounts to prevent hydration issues
  useEffect(() => {
    const now = new Date();

    // Filter banners based on current date and validity
    const filteredBanners = currentBanners.filter(
      (banner) =>
        (banner.startDate ? now >= new Date(banner.startDate) : true) &&
        (banner.endDate ? now <= new Date(banner.endDate) : true)
    );

    const releaseBanners = currentBanners.filter(
      (banner) =>
        (banner.releaseBanner ? banner.releaseBanner : false) &&
        (banner.startDate ? now >= new Date(banner.startDate) : true) &&
        (banner.endDate ? now <= new Date(banner.endDate) : true)
    );

    // Prioritize a Release banner
    if (releaseBanners.length > 0) {
      // There is a Release banner within the current date
      const mostRecentReleaseBanner = releaseBanners.sort((a, b) => {
        // Sort by startDate descending (most recent first)
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      })[0];

      setBanner(mostRecentReleaseBanner);
    } else {
      // randomly select one banner if multiple are valid
      setBanner(
        filteredBanners.length > 0 ? shuffle(filteredBanners)[0] : null
      );
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
      className={`bg-[#1b0e3c] border-y border-white/10 text-white py-3 w-full shadow-md transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pr-8">
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-pink">
              <PinkIcon />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-base font-bold leading-tight">
                {banner.title}
              </h2>
              <p className="text-sm text-grey mt-1">{banner.description}</p>
            </div>
          </div>

          <a
            href={banner.ctaLink}
            className="whitespace-nowrap px-5 py-2 bg-pink hover:bg-[#d61055] text-white text-sm font-bold rounded-full transition-colors duration-300 inline-flex items-center group"
          >
            {banner.cta}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
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

        {/* Close button */}
        {isMounted && (
          <button
            onClick={handleDismiss}
            className="absolute top-1/2 -translate-y-1/2 right-0 p-2 text-grey hover:text-white transition-colors duration-200"
            aria-label="Dismiss banner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
      </div>
    </div>
  );
};

export default Banner;
