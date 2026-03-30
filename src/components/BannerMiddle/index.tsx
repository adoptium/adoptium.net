"use client";

import React, { useState, useEffect } from "react";
import { shuffle } from "../../utils/shuffle";
import { motion } from "framer-motion";
import { currentAnnouncements, BannerMiddleProps } from "./announcements";

const BannerMiddle = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [announcement, setAnnouncement] = useState<BannerMiddleProps | null>(
    null
  );

  // Track when component mounts to prevent hydration issues
  useEffect(() => {
    const now = new Date();

    // Filter announcements based on current date and validity
    const filteredAnnouncements = currentAnnouncements.filter(
      (announcement) =>
        (announcement.startDate
          ? now >= new Date(announcement.startDate)
          : true) &&
        (announcement.endDate ? now <= new Date(announcement.endDate) : true)
    );

    // randomly select one announcement if multiple are valid
    setAnnouncement(
      filteredAnnouncements.length > 0
        ? shuffle(filteredAnnouncements)[0]
        : null
    );
    setIsMounted(true);
  }, []);

  // Don't render if no valid announcement
  if (!announcement) {
    return null;
  }

  return (
    <section className="w-full bg-[#14003c] py-12 relative z-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-sm"
        >
          {/* Glow effects */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#ff1365] rounded-full blur-[100px] opacity-10"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-[#7026b9] rounded-full blur-[100px] opacity-10"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                {announcement.title}
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                {announcement.description}
              </p>
            </div>
            <div className="flex-shrink-0 pt-2 md:pt-0">
              <a
                href={announcement.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-[#ff1365] rounded-full hover:bg-[#ff1365]/90 hover:scale-105 shadow-lg hover:shadow-[#ff1365]/25 group"
              >
                {announcement.cta}
                <svg
                  className="w-5 h-5 ml-2 -mr-1 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BannerMiddle;
