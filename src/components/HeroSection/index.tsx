'use client'

import React, { useState, useEffect } from "react"
import LatestTemurin from "@/components/HeroSection/LatestTemurin"

const HeroSection = () => {
  const [latestLTS, setLatestLTS] = useState<number | string>(21); // Default to 21 if API fails

  useEffect(() => {
    const fetchLatestLTS = async () => {
      try {
        const response = await fetch('/api/available-releases');
        const data = await response.json();
        if (data.mostRecentLts && data.mostRecentLts.version) {
          setLatestLTS(data.mostRecentLts.version);
        }
      } catch (error) {
        console.error("Failed to fetch latest LTS version:", error);
      }
    };

    fetchLatestLTS();
  }, []);

  return (
    <div>
      <div className="-mt-24 sm:bg-contain bg-temurin-hero bg-center bg-no-repeat relative">
        <div className="relative isolate">
          <div className="absolute sm:hidden top-[80px] z-[-1] left-[50%] translate-x-[-50%]">
            {/* <Image 
              src="/images/backgrounds/temurin-hero-bg.svg" 
              alt="background-image"
              width={317}
              height={415}
              priority
            /> */}
          </div>
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>
          <div className="max-w-[1264px] mx-auto flex justify-center items-center">
            <div className="mx-auto max-w-[832px] w-full h-[680px] sm:h-[720px] px-8 lg:px-0 flex items-center">
              <LatestTemurin latestLTS={latestLTS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
