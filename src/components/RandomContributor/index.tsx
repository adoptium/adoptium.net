"use client";

import React, { RefObject, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useOnScreen } from "@/hooks/useOnScreen";
import { useAdoptiumContributorsApi } from "@/hooks/useAdoptiumContributorsApi";
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder";
import LinkText from "@/components/LinkText";

interface RandomContributorProps {
  style?: React.CSSProperties;
}

const RandomContributor: React.FC<RandomContributorProps> = ({ style }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useOnScreen(ref as RefObject<Element>, true);
  const contributor = useAdoptiumContributorsApi(isVisible);
  const t = useTranslations("RandomContributor");

  return (
    <div
      ref={ref}
      className="flex items-center p-5 gap-4 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-pink-500/10 group"
      style={style}
    >
      {!contributor && isVisible && <AnimatedPlaceholder />}
      {contributor && (
        <>
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-70 blur transition-opacity duration-300" />
            <a
              href={contributor.profileUri}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="relative block"
            >
              <Image
                width={64}
                height={64}
                src={contributor.avatarUri}
                className="rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors"
                alt={`Avatar of ${contributor.login}`}
              />
            </a>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium leading-relaxed line-clamp-3">
              {t.rich("thank-you", {
                name: () => (
                  <LinkText
                    href={contributor.profileUri}
                    className="font-bold text-pink hover:text-pink-300 transition-colors"
                  >
                    {contributor.login}
                  </LinkText>
                ),
                contributions: () => (
                  <LinkText
                    href={contributor.commitsListUri}
                    className="text-gray-300 hover:text-white transition-colors border-b border-gray-500/50 hover:border-white/50"
                  >
                    {contributor.contributionsCount}{" "}
                    {t(
                      contributor.contributionsCount === 1
                        ? "contribution-singular"
                        : "contribution-plural"
                    )}
                  </LinkText>
                ),
                repo: () => (
                  <LinkText
                    href={`https://github.com/adoptium/${contributor.repo}`}
                    className="text-gray-300 hover:text-white transition-colors border-b border-gray-500/50 hover:border-white/50"
                  >
                    {contributor.repo}
                  </LinkText>
                ),
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RandomContributor;
