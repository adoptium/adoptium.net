'use client';

import React, { useState, useEffect } from "react";
import { shuffle } from "../../utils/shuffle";

type BannerMiddleProps = {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
};

// ------------------------------------------------------- 
// NOTE: Add your list of current announcements here
// ------------------------------------------------------- 
const currentAnnouncements: BannerMiddleProps[] = [
  {
    title: "Become a sustainer!",
    description: "Join the Eclipse Temurin Sustainer Program to support Eclipse Temurin, the fastest-growing open source JDK. Your support fuels stronger security, faster releases, ready-to-deploy builds, quality testing and community development. ",
    cta: "Learn more!",
    ctaLink: "/sustainers/",
    startDate: "2025-09-30T23:59:59Z",
    endDate: "2025-11-15T23:59:59Z"
  },
  {
    title: "Case Study: Bloomberg’s shift to Open Source Java",
    description: "Discover how Eclipse Temurin helps power global financial infrastructure.",
    cta: "Read the Case Study",
    ctaLink: "https://outreach.eclipse.foundation/bloomberg-temurin-case-study?utm_campaign=22235449-Bloomberg%20Adoptium%20Case%20Study&utm_source=banner&utm_medium=adoptium%20website",
    startDate: "2025-11-16T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
  }
];

const BannerMiddle = () => {

  const [isMounted, setIsMounted] = useState(false);
  const [announcement, setAnnouncement] = useState<BannerMiddleProps | null>(null);

  // Track when component mounts to prevent hydration issues
  useEffect(() => {
    const now = new Date();

    // Filter announcements based on current date and validity
    const filteredAnnouncements = currentAnnouncements
      .filter(announcement => (now >= new Date(announcement.startDate) && now <= new Date(announcement.endDate)));

    // randomly select one announcement if multiple are valid
    setAnnouncement(filteredAnnouncements.length > 0 ? shuffle(filteredAnnouncements)[0] : null);
    setIsMounted(true);
  }, []);

  // Don't render if no valid announcement
  if (!announcement) {
    return null;
  }

  return (
    <div className='relative w-full'>
      <div className="w-full h-[1px] my-32 lg:my-16 bg-[#3E3355]"></div>
      <div className='absolute w-full top-[-72px]'>
        <div className="relative border border-[#3E3355] md:rounded-lg container mx-auto px-4 bg-purple">
          <div className={`from-[#0E002A] via-[#240b50] to-[#9a227a] py-5 w-full shadow-lg`}>
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center relative">
                <div className={`flex items-center gap-4 mb-3 md:mb-0 ${isMounted ? 'pr-8' : ''}`}>
                  <div>
                    <h2 className="text-[16px] md:text-2xl font-extrabold text-white leading-tight">
                      <span className="text-primary">{announcement.title}</span>
                    </h2>
                    <p className="text-[14px] text-gray-200 mt-1 max-w-2xl">
                      {announcement.description} <a href={announcement.ctaLink} target="_blank" rel="noopener noreferrer" className="text-primary">{announcement.cta}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
  );
};

export default BannerMiddle;
