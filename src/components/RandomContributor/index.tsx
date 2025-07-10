'use client'

import React, { RefObject, useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useOnScreen } from "@/hooks/useOnScreen"
import { useAdoptiumContributorsApi } from "@/hooks/useAdoptiumContributorsApi"
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder"
import LinkText from "@/components/LinkText"

interface RandomContributorProps {
  style?: React.CSSProperties
}

const RandomContributor: React.FC<RandomContributorProps> = ({ style }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const isVisible = useOnScreen(ref as RefObject<Element>, true)
  const contributor = useAdoptiumContributorsApi(isVisible)
  const t = useTranslations('RandomContributor')

  return (
    <div
      ref={ref}
      className="flex items-center justify-center p-4 space-x-4 w-[325px] rounded-3xl border border-white/50"
      style={style}
    >
      {!contributor && isVisible && <AnimatedPlaceholder />}
      {contributor && (
        <>
          <div className="random-contributor-avatar">
            <a
              href={contributor.profileUri}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <Image
                width={140}
                height={140}
                src={contributor.avatarUri}
                className="!mb-0 rounded-full"
                alt="Avatar of an Adoptium contributor"
              />
            </a>
          </div>
          <div className="random-contributor-thank text-white text-sm font-normal leading-6">
            {t.rich('thank-you', {
              name: () => (
                <LinkText href={contributor.profileUri}>
                  {contributor.login}
                </LinkText>
              ),
              contributions: () => (
                <LinkText href={contributor.commitsListUri}>
                  {contributor.contributionsCount} {t(contributor.contributionsCount === 1 ? 'contribution-singular' : 'contribution-plural')}
                </LinkText>
              ),
              repo: () => (
                <LinkText href={`https://github.com/adoptium/${contributor.repo}`}>
                  {contributor.repo}
                </LinkText>
              ),
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default RandomContributor
