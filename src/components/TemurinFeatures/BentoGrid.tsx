"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

const BentoGrid = () => {
  const t = useTranslations("TemurinFeatures");

  const features = [
    {
      key: "secure-supply-chain",
      icon: "/images/icons/lock.svg",
      colSpan: "md:col-span-2",
      bg: "bg-gradient-to-br from-[#1a0b2e] to-[#2d1b4e]",
    },
    {
      key: "aqavit-verification",
      icon: "/images/initiatives/testing.svg",
      colSpan: "md:col-span-1",
      bg: "bg-[#0d002a]",
    },
    {
      key: "performance-optimization",
      icon: "/images/initiatives/deploy.svg",
      colSpan: "md:col-span-1",
      bg: "bg-[#0d002a]",
    },
    {
      key: "cross-platform",
      icon: "/images/initiatives/release.svg",
      colSpan: "md:col-span-2",
      bg: "bg-gradient-to-bl from-[#2d1b4e] to-[#1a0b2e]",
    },
    {
      key: "community-driven",
      icon: "/images/initiatives/community.svg",
      colSpan: "md:col-span-1",
      bg: "bg-[#0d002a]",
    },
    {
      key: "enterprise-ready",
      icon: "/images/initiatives/security.svg",
      colSpan: "md:col-span-1",
      bg: "bg-[#0d002a]",
    },
  ];

  return (
    <section className="py-24 bg-[#14003c] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("title")}</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className={`${feature.colSpan} ${feature.bg} rounded-3xl p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border border-white/5`}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Image
                      src={feature.icon}
                      alt={t(`features.${feature.key}.title`)}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>
                </div>
              </div>

              {/* Decorative gradient glow on hover */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#ff1365] rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
