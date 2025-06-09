"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { DiGithubFull } from "react-icons/di"

interface DownloadCountData {
  total: number
}

const DownloadCounter = () => {
  const t = useTranslations('DownloadCounter')
  const [downloadData, setDownloadData] = useState<DownloadCountData | null>(null)
  const [count, setCount] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  // Fetch download count from our API route with caching
  useEffect(() => {
    const fetchDownloadCount = async () => {
      try {
        // Check if we have cached data and if it's still valid (less than 1 hour old)
        const cachedData = localStorage.getItem('adoptium_download_count')
        const cachedTimestamp = localStorage.getItem('adoptium_download_count_timestamp')

        const now = Date.now()
        const oneHourInMs = 60 * 60 * 1000

        // Use cached data if it exists and is less than 1 hour old
        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp, 10)) < oneHourInMs) {
          setDownloadData({ total: parseInt(cachedData, 10) })
          setLoading(false)
          return
        }

        // If no valid cache, fetch from our API route
        const response = await fetch('/api/download-counter')
        if (!response.ok) {
          throw new Error('Failed to fetch download count')
        }

        const data = await response.json()

        // Handle the total downloads count from the API response
        if (data && typeof data.total === 'number') {
          const total = data.total

          // Save to cache
          localStorage.setItem('adoptium_download_count', total.toString())
          localStorage.setItem('adoptium_download_count_timestamp', now.toString())

          setDownloadData({ total })
        } else {
          console.error('Unexpected data structure:', data)
          throw new Error('Invalid response structure')
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching download count:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
        // Fallback to a reasonable number if API fails
        setDownloadData({ total: 1000000000 })
      }
    }

    fetchDownloadCount()
  }, [])

  const endValue = downloadData?.total || 0
  const startValue = Math.max(0, endValue - 10) // Start value of counter
  const duration = 500 // Duration of the animation in milliseconds

  useEffect(() => {
    if (!downloadData || animate) return

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
  }, [animate, downloadData, endValue, startValue, duration])

  if (loading) {
    return (
      <div className="bg-purple py-8 lg:py-16">
        <div className="mx-auto max-w-[832px] w-full px-6 lg:px-0 flex flex-col items-center justify-center">
          <h2 className="text-center text-[36px] sm:text-5xl font-semibold leading-[44px] sm:leading-[56px] text-white">
            {t('title')}
          </h2>
          <h3 className="text-center text-[64px] lg:text-[104px] leading-[72px] lg:leading-[120px] font-semibold" style={{ color: '#FF1365' }}>
            {t('loading')}
          </h3>
          <div className="flex items-center gap-4 flex-wrap sm:gap-6 justify-center">
            <span>
              <DiGithubFull size={70} />
            </span>
            <p className="text-[16px] font-normal leading-6 text-white mb-0">
              {t('total-download-docker-pulls-ever')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-purple py-8 lg:py-16">
        <div className="mx-auto max-w-[832px] w-full px-6 lg:px-0 flex flex-col items-center justify-center">
          <h2 className="text-center text-[36px] sm:text-5xl font-semibold leading-[44px] sm:leading-[56px] text-white">
            {t('title')}
          </h2>
          <h3 className="text-center text-[64px] lg:text-[104px] leading-[72px] lg:leading-[120px] font-semibold text-pink my-8">
            1B+
          </h3>
          <div className="flex items-center gap-4 flex-wrap sm:gap-6 justify-center">
            <span>
              <DiGithubFull size={70} />
            </span>
            <p className="text-[16px] font-normal leading-6 text-white mb-0">
              {t('total-download-docker-pulls-ever')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-purple py-8 lg:py-16" ref={counterRef}>
      <div className="mx-auto max-w-[832px] w-full px-6 lg:px-0 flex flex-col items-center justify-center">
        <h2 className="text-center text-[36px] sm:text-5xl font-semibold leading-[44px] sm:leading-[56px] text-white">
          {t('title')}
        </h2>
        <h3 className="text-center text-[64px] lg:text-[104px] leading-[72px] lg:leading-[120px] font-semibold my-8" style={{ color: '#FF1365' }}>
          {count.toLocaleString()}
        </h3>
        <div className="flex items-center gap-4 flex-wrap sm:gap-6 justify-center">
          <span>
            <DiGithubFull size={70} />
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
