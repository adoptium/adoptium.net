"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { DiGithubFull } from "react-icons/di"

interface DownloadCounterProps {
  total: number;
}

const DownloadCounter = ({ total }: DownloadCounterProps) => {
  const t = useTranslations('DownloadCounter')
  const [count, setCount] = useState(0)
  const [animate, setAnimate] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  const endValue = total || 0
  const startValue = Math.max(0, endValue - 10)
  const duration = 500

  useEffect(() => {
    if (animate) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animate) {
          setAnimate(true)
          let startTimestamp: number | null = null

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min(
              (timestamp - startTimestamp) / duration,
              1,
            )
            setCount(
              Math.floor(progress * (endValue - startValue) + startValue),
            )
            if (progress < 1) {
              window.requestAnimationFrame(step)
            }
          }
          window.requestAnimationFrame(step)
        }
      },
      { root: null, threshold: 0.5 },
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [animate, endValue, startValue, duration])

  return (
    <div className="bg-purple py-8 lg:py-6" ref={counterRef}>
      <div className="mx-auto max-w-[832px] w-full px-6 lg:px-0 flex flex-col items-center justify-center">
        <h2 className="text-center text-[24px] sm:text-3xl font-semibold leading-[32px] sm:leading-[40px] text-white">
          {t('title')}
        </h2>
        <h3 className="text-center text-[40px] lg:text-[64px] leading-[48px] lg:leading-[72px] font-semibold my-4" style={{ color: '#FF1365' }}>
          {count.toLocaleString()}
        </h3>
        <div className="flex items-center gap-4 flex-wrap sm:gap-6 justify-center">
          <span>
            <DiGithubFull size={50} />
          </span>
          <p className="text-[16px] font-normal leading-6 text-white mb-0">
            {t('total-download-docker-pulls-ever')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DownloadCounter
