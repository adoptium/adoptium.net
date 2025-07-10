import { useTranslations } from "next-intl"
import UiMobileScroll from "./mobile"
import UiVirtualContent from "./UiVirtualContent"

import "./UiVirtualScroll.css"

const UiVirtualScroll = () => {
  const t = useTranslations("PowerOfTemurin")
  const data = [
    {
      title: t("benefits.performance.title"),
      description: t("benefits.performance.description"),
      image: "feature-layers.svg",
    },
    {
      title: t("benefits.cost.title"),
      description: t("benefits.cost.description"),
      image: "feature-layers.svg",
    },
    {
      title: t("benefits.developers.title"),
      description: t("benefits.developers.description"),
      image: "feature-layers.svg",
    },
  ]
  return (
    <>
      <UiMobileScroll data={data} />
      <div className="lg:block hidden open-animation-wrapper">
        <UiVirtualContent data={data} />
      </div>
    </>
  )
}

export default UiVirtualScroll
