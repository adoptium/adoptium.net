"use client";

import { useTranslations } from "next-intl";
import RandomContributor from "@/components/RandomContributor";
import { motion } from "framer-motion";
import "./styles.css";

const ContributorsHome = () => {
  const t = useTranslations("RandomContributors");

  // Positions for the scattered layout - Circular arrangement
  const positions = [
    // 1. Top Center (12 o'clock) - Pushed further up
    {
      className:
        "lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-full",
      delay: 0,
    },
    // 2. Top Right (2 o'clock) - Pushed further out
    {
      className: "lg:absolute lg:top-[10%] lg:right-0 lg:translate-x-16",
      delay: 1,
    },
    // 3. Bottom Right (4 o'clock) - Pushed further out
    {
      className: "lg:absolute lg:bottom-[10%] lg:right-0 lg:translate-x-16",
      delay: 2,
    },
    // 4. Bottom Center (6 o'clock) - Pushed further down
    {
      className:
        "lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-full",
      delay: 0.5,
    },
    // 5. Bottom Left (8 o'clock) - Pushed further out
    {
      className: "lg:absolute lg:bottom-[10%] lg:left-0 lg:-translate-x-16",
      delay: 2.5,
    },
    // 6. Top Left (10 o'clock) - Pushed further out
    {
      className: "lg:absolute lg:top-[10%] lg:left-0 lg:-translate-x-16",
      delay: 1.5,
    },
  ];

  return (
    <section className="relative py-24 lg:py-40 overflow-hidden contributors min-h-[1000px] flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative w-full h-full">
        {/* Central Text Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-3xl mx-auto h-full min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8 tracking-tight">
              {t.rich("thank-you", {
                highlight: (chunks) => (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff1365] to-[#bf004c] inline-block">
                    {chunks}
                  </span>
                ),
              })}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <a
                href="https://github.com/adoptium"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 hover:border-pink-500/50 backdrop-blur-md shadow-lg hover:shadow-pink-500/20 group"
              >
                Become a Contributor
                <svg
                  className="w-5 h-5 ml-2 -mr-1 transition-transform duration-300 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scattered Contributors */}
        <div className="lg:absolute lg:inset-0 w-full h-full pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:block lg:h-full">
            {positions.map((pos, index) => (
              <motion.div
                key={index}
                className={`pointer-events-auto ${pos.className} w-full lg:w-auto flex justify-center`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: pos.delay * 0.2,
                  type: "spring",
                  stiffness: 50,
                }}
              >
                <div className="w-full max-w-[320px]">
                  <RandomContributor />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContributorsHome;
