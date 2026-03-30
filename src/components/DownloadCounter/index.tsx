"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { DiGithubFull } from "react-icons/di";
import { motion } from "framer-motion";

interface DownloadCounterProps {
  total: number;
}

const DownloadCounter = ({ total }: DownloadCounterProps) => {
  const t = useTranslations("DownloadCounter");
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  const endValue = total || 0;
  const startValue = Math.max(0, endValue - 10);
  const duration = 500;

  useEffect(() => {
    if (animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animate) {
          setAnimate(true);
          let startTimestamp: number | null = null;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
              (timestamp - startTimestamp) / duration,
              1
            );
            setCount(
              Math.floor(progress * (endValue - startValue) + startValue)
            );
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { root: null, threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [animate, endValue, startValue, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-purple py-8 lg:py-16"
      ref={counterRef}
    >
      <div className="mx-auto max-w-[832px] w-full px-6 lg:px-0 flex flex-col items-center justify-center">
        <h2 className="text-center text-[36px] sm:text-5xl font-semibold leading-[44px] sm:leading-[56px] text-white">
          {t("title")}
        </h2>
        <h3
          className="text-center text-[64px] lg:text-[104px] leading-[72px] lg:leading-[120px] font-semibold my-8"
          style={{ color: "#FF1365" }}
        >
          {count.toLocaleString()}
        </h3>
        <div className="flex items-center gap-4 flex-wrap sm:gap-6 justify-center">
          <span>
            <DiGithubFull size={70} />
          </span>
          <p className="text-[16px] font-normal leading-6 text-white mb-0">
            {t("total-download-docker-pulls-ever")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadCounter;
