import React from "react"
import { Link } from "@/i18n/navigation"
import CommonHeading from "@/components/Common/CommonHeading"

const InstallationGuideCard = () => {
  const carddata = [
    {
      id: 1,
      title: "Installation Guide",
      description:
        "Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime.",
      button: "Installation Guide",
      link: "/installation",
    },
    {
      id: 2,
      title: "Documentation",
      description:
        "Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime.",
      button: "Documentation",
      link: "/docs",
    },
  ]
  return (
    <section className="pb-16 pt-0 md:py-32 mx-auto max-w-[832px] w-full lg:px-2 flex flex-col items-center justify-center  xl:px-0 px-6">
      <CommonHeading
        className="text-center"
        title={"Become a Sponsor"}
        description={
          "Contributions from users like you help fund critical operations of the Adoptium working group. All money contributed through the Eclipse Foundation ensures the survivability, continuity, and responsiveness of Adoptium projects."
        }
      />
      <Link href={"/sustainers/"}>
        <button className="bg-transparent mt-10 border-2 border-pink-500/0 text-white text-base leading-6 font-bold w-[191px] h-[48px] rounded-2xl gradient-border">
          Learn more
        </button>
      </Link>
      <div className="mt-16  gap-4 md:gap-8  flex flex-wrap justify-center items-center">
        {carddata.map((data, index) => (
          <div
            key={index}
            className="p-10 flex flex-col max-w-[400px] newscard-2 h-[440px] md:h-[480px] bg-[#200E46]"
          >
            <div className="grow">
              <h3 className="text-white text-[30px] font-semibold  leading-[120%] md:text-[40px]">
                {data.title}
              </h3>
              <p className="mt-6 text-xl text-lightgrey font-normal">
                {data.description}
              </p>
            </div>
            <Link href={data.link}>
              <button className="bg-transparent border-2 border-pink-500/0 text-white text-base leading-6 font-normal w-[180px] h-[48px] rounded-2xl gradient-border">
                {data.button}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default InstallationGuideCard
