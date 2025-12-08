"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import DownloadButton from "./DownloadButton";
import LogoCarousel from "@/components/LogoCarousel";
import Image from "next/image";

type HeroSectionProps = {
  latestLTS: number;
};

const HeroSection = ({ latestLTS }: HeroSectionProps) => {
  const tHomePage = useTranslations("HomePage");
  const tTemurinFeatures = useTranslations("TemurinFeatures");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#14003c] pt-20 pb-10"
    >
      {/* Background Gradient/Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#ff1365] rounded-full blur-[120px] opacity-10 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7026b9] rounded-full blur-[120px] opacity-10 animate-pulse delay-1000" />
      </div>
      {/* Animated Background Logo */}
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute inset-0 z-0 hidden md:flex items-start justify-center pointer-events-none"
      >
        <div className="relative w-[1000px] h-[1000px] -mt-32">
          <Image
            src="/images/backgrounds/temurin-hero-img.png"
            alt="Temurin Logo Background"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>{" "}
      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 max-w-[20ch] mx-auto leading-tight"
            style={{ textWrap: "balance" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              {tHomePage("the-power")}
            </span>
            <span className="text-[#ff1365]">.</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-2xl md:text-3xl text-gray-300 max-w-3xl mb-12 font-normal leading-relaxed"
        >
          {tTemurinFeatures("title")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 mb-12"
        >
          <DownloadButton latestLTS={latestLTS} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-7xl mx-auto"
        >
          <LogoCarousel />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
