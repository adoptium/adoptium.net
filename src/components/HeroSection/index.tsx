import Image from "next/image"
import LatestTemurin from "@/components/HeroSection/LatestTemurin"

type HeroSectionProps = {
  latestLTS: number
}

const HeroSection = ({ latestLTS }: HeroSectionProps) => {
  return (
    <div>
      <div className="-mt-24 sm:bg-contain bg-temurin-hero bg-center bg-no-repeat relative">
        <div className="relative isolate">
          <div className="absolute sm:hidden top-[80px] z-[-1] left-0 w-full flex justify-center">
            <Image
              src="/images/backgrounds/temurin-hero-mobile.svg"
              className="max-w-80 h-auto"
              width={600}
              height={0}
              alt="Temurin Hero Mobile Background"
              draggable="false"
            />
          </div>
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>
          <div className="max-w-[1264px] mx-auto flex justify-center items-center">
            <div className="mx-auto max-w-[832px] w-full h-[680px] sm:h-[720px] px-8 lg:px-0 flex items-center">
              <LatestTemurin latestLTS={latestLTS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
