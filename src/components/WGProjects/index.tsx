import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { PinkIcon } from "../Common/Icon"

interface Project {
  title: string
  imagePath: string
  link: string
  overline: string
}

const projects: Project[] = [
  {
    title: "Eclipse Temurin™",
    imagePath: "temurin-project.svg",
    link: "/temurin",
    overline: "Runtimes and Development Kits",
  },
  {
    title: "Eclipse AQAvit",
    imagePath: "aqavit-project.svg",
    link: "/aqavit",
    overline: "Quality Assurance",
  },
  {
    title: "Eclipse Mission Control",
    imagePath: "mc-project.svg",
    link: "/jmc",
    overline: "JDK Mission Control",
  },
]

const WGProjects = () => {
  const t = useTranslations('WGProjects')
  return (
    <div className="bg-[#0d002a] py-24 sm:py-28">
      <div className="mx-auto max-w-3xl md:max-w-7xl w-full px-6 xl:px-0">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-center text-2xl md:text-5xl font-semibold text-white md:leading-[56px] leading-[44px] mb-4">
            {t('discover-all-our-projects')}
          </h2>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="mt-6 max-w-2xl mb-0 text-base leading-6 text-lightgrey text-center md:text-justify md:[text-align-last:center]">
            {t('description')}
          </p>
        </div>
        <div className="mt-16 mb-8 flex md:h-[30em] justify-around lg:justify-between flex-wrap lg:flex-nowrap gap-6 xl:gap-8">
          {projects.map((project, index) => (
            <div key={index} className="max-w-xl w-full h-full">
              <div className="bg-white/5 flex justify-between h-full flex-col p-8 xl:p-12 rounded-3xl border-2 border-white/50">
                <Image
                  src={`/images/projects/${project.imagePath}`}
                  alt={`${project.title} logo`}
                  className="w-[140px]"
                  width={140}
                  height={70}
                />
                <div className="flex-col justify-center items-start gap-2">
                  <div className="justify-start items-center gap-3 inline-flex pt-4">
                    <PinkIcon />
                    <p className="text-rose-600 mb-0 text-base leading-6 font-bold">
                      {project.overline}
                    </p>
                  </div>
                  <h2 className="text-white text-xl md:text-3xl leading-8 md:leading-10 font-semibold mt-2">
                    {project.title}
                  </h2>
                  <Link href={project.link}>
                    <button className="bg-transparent border-2 mt-8 sm:mt-10 border-pink-500/0 text-white text-base leading-6 font-bold w-[148px] h-[48px] rounded-2xl gradient-border">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WGProjects
