"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface SubText {
  title: string;
  amount: string;
}

interface DataItem {
  title: string;
  description: React.ReactElement | string;
  image: string;
  subtext?: SubText;
}

const UiVirtualContent = ({ data }: { data: DataItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="relative h-[150vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pb-16">
        <div className="relative w-full h-full flex items-center justify-between">
          {/* Left Side - Images (Stacked/Fading) */}
          <div className="w-1/2 h-full flex items-center justify-center relative">
            {data.map((item, index) => (
              <FeatureImage
                key={index}
                item={item}
                index={index}
                total={data.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* Right Side - Text (Scrolling/Fading) */}
          <div className="w-1/2 h-full flex items-center justify-center relative pl-12">
            {data.map((item, index) => (
              <FeatureText
                key={index}
                item={item}
                index={index}
                total={data.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureImage = ({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: DataItem;
  index: number;
  total: number;
  scrollYProgress: any;
}) => {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const isLast = index === total - 1;

  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [start, end - step * 0.2, end]
      : isLast
      ? [start, start + step * 0.2, end]
      : [start, start + step * 0.2, end - step * 0.2, end],
    index === 0 ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  // Slight scale effect
  const scale = useTransform(
    scrollYProgress,
    index === 0
      ? [start, end]
      : isLast
      ? [start, start + step * 0.5, end]
      : [start, start + step * 0.5, end],
    index === 0 ? [1, 0.8] : isLast ? [0.8, 1, 1] : [0.8, 1, 0.8]
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {item.subtext ? (
        <div className="flex flex-col justify-center items-center bg-[#1a0050]/50 backdrop-blur-md p-10 rounded-3xl border border-white/10">
          <Image
            src={`/images/icons/${item.image}`}
            alt={item.title}
            width={300}
            height={300}
            className="mb-6 drop-shadow-2xl"
          />
          <h2 className="text-5xl font-bold text-white mb-2">
            {item.subtext.title}
          </h2>
          <p className="text-3xl text-[#ff1365] font-mono">
            {item.subtext.amount}
          </p>
        </div>
      ) : (
        <div className="relative w-full max-w-[500px] aspect-square">
          <Image
            src={`/images/icons/${item.image}`}
            alt={item.title}
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      )}
    </motion.div>
  );
};

const FeatureText = ({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: DataItem;
  index: number;
  total: number;
  scrollYProgress: any;
}) => {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const isLast = index === total - 1;

  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [start, end - step * 0.2, end]
      : isLast
      ? [start, start + step * 0.2, end]
      : [start, start + step * 0.2, end - step * 0.2, end],
    index === 0 ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    index === 0 ? [start, end] : isLast ? [start, end] : [start, end],
    index === 0 ? [0, -50] : isLast ? [50, 0] : [50, -50]
  );

  return (
    <motion.div style={{ opacity, y }} className="absolute w-full max-w-lg">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
        {item.title}
      </h2>
      <div className="text-xl text-gray-300 leading-relaxed font-light">
        {item.description}
      </div>
    </motion.div>
  );
};

export default UiVirtualContent;
