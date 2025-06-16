'use client'

import { useTranslations } from 'next-intl'
import RandomContributor from "@/components/RandomContributor"

const Contributors = () => {
  const t = useTranslations('RandomContributors');

  return (
    <div className="bg-blue border-[#3E3355] border-b py-10 px-6">
      <div className="flex flex-col lg:flex-row max-w-[1048px] mx-auto justify-center lg:justify-between gap-5 items-center">
        <p className="text-3xl md:text-4xl leading-[38px] md:leading-[48px] text-white my-0 text-center">
          {t.rich('thank-you', {
            highlight: (chunks) => <span className="text-pink pr-1">{chunks}</span>
          })}
        </p>
        <RandomContributor />
      </div>
    </div>
  )
}

export default Contributors
