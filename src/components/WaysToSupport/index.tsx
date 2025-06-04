import React from "react"
import { useTranslations } from "next-intl"
import CommonHeading from "@/components/Common/CommonHeading"
import CommonCard from "@/components/Common/CommonCard"

const WaysToSupport = () => {
  const t = useTranslations("WaysToSupport")
  const data = [
    {
      title: t('contribute.how-to-contribute'),
      description: t('contribute.description'),
      button: t('contribute.how-to-contribute'),
      href: "/contributing/",
    },
    {
      title: t('sustainers.title'),
      description: t('sustainers.description'),
      button: t('sustainers.title'),
      href: "/sustainers",
    },
    {
      title: t('member.title'),
      description: t('member.description'),
      button: t('member.title'),
      href: "/join",
    },
  ]
  return (
    <section className="py-16 md:py-32 mx-auto bg-[#14003C] max-w-[1264px] w-full lg:px-2 xl:px-0 px-8">
      <CommonHeading
        className="text-center"
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-16 gap-4 md:gap-8 flex flex-wrap justify-center items-center">
        {data.map((item, index) => (
          <div key={index} className="">
            <CommonCard data={item} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default WaysToSupport
