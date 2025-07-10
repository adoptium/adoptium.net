import React from "react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

import UiVirtualScroll from "@/components/UiVirtualScroll"

const PowerOfTemurin = () => {
  const t = useTranslations("PowerOfTemurin")
  return (
    <div className="bg-purple py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 flex flex-col items-center justify-center mb-16">
        <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
          {t("title")}
        </h2>
        <h3 className="text-center text-base leading-6 font-normal text-grey mt-6">
          {t("description")}
        </h3>
        <Link href="/business-benefits">
          <button className="bg-transparent mt-10 border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[191px] h-[48px] rounded-2xl gradient-border">
            {t("button")}
          </button>
        </Link>
      </div>
      <UiVirtualScroll />
    </div>
  )
}

export default PowerOfTemurin
