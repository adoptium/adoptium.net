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
  releaseBanner?: boolean; // Indicates if this is a Release banner (priority banner)
};

// -------------------------------------------------------
// NOTE: Add your list of current banners here
// - Each banner can have optional startDate and endDate in ISO format
//     > an undefined start date is displayed immediately
//     > an undefined end date is displayed indefinitely
// - Banners with dates are only valid within that range
// - Banners are always displayed randomly
// - Banners marked as releaseBanner will be prioritized if within date range
//     > only one releaseBanner will be shown at a time, the most recent one
//     > undefined release banner flag is equivalent to 'false' behavior
// - Do not set releaseBanner to true for non-release banners
// -------------------------------------------------------
const currentBanners: BannerProps[] = [
  {
    title:
      "End of Support: Solaris & Windows 32-bit for Eclipse Temurin in 2026",
    description:
      "Temurin builds for Solaris and Windows 32-bit will be discontinued in 2026. Review the upcoming changes and share your feedback.",
    cta: "Read the full announcement",
    ctaLink: "https://adoptium.net/news/2025/12/solaris-win32-removal",
    startDate: "2025-12-11T00:00:00Z",
    endDate: "2026-01-06T23:59:59Z",
  },
  {
    title: "Help sustain Adoptium this Giving Tuesday",
    description:
      "Your support helps us maintain the open infrastructure that powers reliable release cycles and secure builds across the Adoptium ecosystem — including Eclipse Temurin.",
    cta: "Become a sponsor today",
    ctaLink:
      "https://www.eclipse.org/sponsor/adoptium/?scope=banner-1&campaign=giving-tuesday",
    startDate: "2025-11-13T00:00:00Z",
    endDate: "2025-12-03T23:59:59Z",
  },
  {
    title: "January 2026 PSU Binaries - In Progress",
    description:
      "We are creating the January 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-01-20T00:00:00Z",
    endDate: "2026-02-03T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "March 2026 Feature Release Binaries - In Progress",
    description:
      "We are creating the March 2026 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-03-17T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "April 2026 PSU Binaries - In Progress",
    description:
      "We are creating the April 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-04-21T00:00:00Z",
    endDate: "2026-05-05T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "July 2026 PSU Binaries - In Progress",
    description:
      "We are creating the July 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-07-21T00:00:00Z",
    endDate: "2026-08-04T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "September 2026 Feature Release Binaries - In Progress",
    description:
      "We are creating the September 2026 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-09-15T00:00:00Z",
    endDate: "2026-09-29T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "October 2026 PSU Binaries - In Progress",
    description:
      "We are creating the October 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-10-20T00:00:00Z",
    endDate: "2026-11-03T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "January 2027 PSU Binaries - In Progress",
    description:
      "We are creating the January 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-01-19T00:00:00Z",
    endDate: "2027-02-02T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "March 2027 Feature Release Binaries - In Progress",
    description:
      "We are creating the March 2027 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-03-16T00:00:00Z",
    endDate: "2027-03-30T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "April 2027 PSU Binaries - In Progress",
    description:
      "We are creating the April 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-04-20T00:00:00Z",
    endDate: "2027-05-04T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "July 2027 PSU Binaries - In Progress",
    description:
      "We are creating the July 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-07-20T00:00:00Z",
    endDate: "2027-08-03T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "September 2027 Feature Release Binaries - In Progress",
    description:
      "We are creating the September 2027 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-09-21T00:00:00Z",
    endDate: "2027-10-05T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "October 2027 PSU Binaries - In Progress",
    description:
      "We are creating the October 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-10-19T00:00:00Z",
    endDate: "2027-11-02T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "DO NOT REMOVE - Fake Banner for Testing",
    description: "This is a fake banner used for testing purposes only.",
    cta: "Read the Case Study",
    ctaLink: "https://example.com",
    startDate: "2012-12-21T00:00:00Z",
    endDate: "2012-12-21T23:59:59Z",
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
