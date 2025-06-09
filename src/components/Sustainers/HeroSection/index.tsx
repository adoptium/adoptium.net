import React from "react"
import PageHeader from "@/components/Common/PageHeader"
import BecomeSustainer from "@/components/Sustainers/BecomeSustainer"

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0d0129]/80 via-[#410170]/60 to-[#0d0129]/80"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff1464]/10 filter blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#410170]/20 filter blur-[120px]"></div>
      </div>
      <PageHeader
        title="Join us in strengthening the future of Eclipse Temurin"
        subtitle="Become a Corporate Sustainer"
        className={"max-w-[1016px] mx-auto relative z-10"}
      />
      <BecomeSustainer />
    </div>
  )
}

export default HeroSection
