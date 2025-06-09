import React from "react"
import Calculator from "./calculator"

const SavingsCalculator: React.FC = () => {
  return (
    <div className="bg-[#0d0129] w-full py-[95px] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-[#410170]/10 filter blur-[150px]"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#ff1464]/5 filter blur-[120px]"></div>
      </div>
      <div className="max-w-[1180px] mx-auto w-full relative z-10">
        <div className="w-full flex flex-col justify-center items-center p-8 bg-gradient-to-b from-[#1e1133]/30 to-[#0d0129]/30 backdrop-blur-sm rounded-2xl border border-[#39314a]/30">
          <h2 className="text-left max-w-[855px] md:text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
            Calculate your savings and Invest in Temurin&apos;s Future
          </h2>
          <p className="text-[#ff1464] max-w-[740px] text-[20px] text-center font-bold mt-10 mb-6">
            The average company* using Eclipse Temurin saves more than $1.6M
            annually. Isn&apos;t it time you invest in sustaining your savings?
          </p>
          <p className="text-xs text-[#c4bfce] my-5">
            *Self-reported number of employees, n = 211
          </p>
          <Calculator />
          <p className="text-[#c4bfce] max-w-[900px] text-center mt-8 leading-relaxed">
            With the recent increase in licensing costs for paid Java SE
            options, we&apos;ve seen Temurin downloads surge—from over 75M in
            2023 to over 250M by the end of 2023, and doubling again to more
            than 500M by the end of 2024. This growth strongly indicates a
            significant transition away from paid Java options toward
            open-source solutions like Temurin. If your organization has
            made this migration, you&apos;ve likely experienced significant cost
            savings. Dedicate a portion of your savings to Temurin to invest
            in your corporate software supply chain by ensuring Temurin&apos;s
            long-term viability, enhance security, and accelerate faster
            releases for the Java community.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SavingsCalculator
