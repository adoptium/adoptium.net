import UiMobileScroll from "./mobile"
import UiVirtualContent from "./UiVirtualContent"

import "./UiVirtualScroll.css"

const data = [
  {
    title: "Performance & Reliability",
    description:
      "Run your enterprise applications with confidence using Eclipse Temurin, a secure, high-performance Java runtime rigorously tested for stability and optimized for seamless operation across diverse environments.",
    image: "feature-layers.svg",
  },
  {
    title: "Cost-Effective Innovation",
    description:
      "Adopt high-quality open source Java with no licensing fees. Reduce costs while benefiting from a robust ecosystem that ensures long-term sustainability and enterprise-ready runtime performance.",
    image: "feature-layers.svg",
  },
  {
    title: "Empowering Developers",
    description:
      "Boost developer productivity with Eclipse Temurin’s consistent, cross-platform builds. Focus on innovation while relying on a dependable, high-quality runtime trusted by millions worldwide.",
    image: "feature-layers.svg",
  },
]

const UiVirtualScroll = () => {
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
