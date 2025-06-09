import { Metadata } from "next"
import React from "react"
import HeroSection from "@/components/Sustainers/HeroSection"
import Program from "@/components/Sustainers/Program"
import KeyInitiatives from "@/components/Sustainers/KeyInitiatives"
import SavingsCalculator from "@/components/Sustainers/SavingsCalculator"
import SustainerLevels from "@/components/Sustainers/Levels"
import Logos, { LogoType } from "@/components/Logos"

export const metadata: Metadata = {
  title: "Sustainers",
  description: "Support the Adoptium project and become a Sustainer"
}

export default function SustainersPage() {
  return (
    <div>
      <HeroSection />

      <div className="w-full flex flex-col justify-center items-center pt-[240px] md:pt-[120px]">
        <Program />
        <KeyInitiatives />
        <SavingsCalculator />

        <div className="w-full max-w-[1180px] p-4">
          <SustainerLevels />
          <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900 mb-8 mt-40 relative">
            <div className="absolute -left-full -right-full -top-20 -z-10">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff1464]/20 to-transparent"></div>
            </div>
            Temurin&apos;s Sustainers
          </h2>
          <div className="p-4 bg-gradient-to-b from-[#1e1133]/20 to-[#0d0129]/20 backdrop-blur-sm rounded-xl border border-[#39314a]/30">
            <Logos
              members={LogoType.SPONSOR}
              title=""
              description="Adoptium is proud to receive financial donations both one-off and regularly from the following companies."
            />
            <Logos
              members={LogoType.INFRA}
              title=""
              description="The Adoptium Working Group collaborates with the following companies who contribute various kinds of cloud and physical hardware."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
