import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import PageHeader from "@/components/Common/PageHeader"
import ContactUs from "@/components/ContactUs"
import Logos, { LogoType } from "@/components/Logos"
import { MembersHeader } from "@/components/MembersHeader"

export const metadata: Metadata = {
  title: "Our Members",
  description: "View the members of the Eclipse Adoptium community, including strategic, enterprise, and participant members who use Eclipse Temurin in production.",
}

export default function MembersPage() {
  return (
    <div>
      <PageHeader
        title="Who we work with"
        subtitle="Our Members"
        description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
      />

      <MembersHeader />

      <div className="w-full px-3 pt-2 pb-4 mb-4">
        <div className="max-w-4xl mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 md:space-x-10 whitespace-nowrap justify-center py-2 min-w-max">
            <Link href="#strategic-sec">
              <span
                className="px-3 py-2 text-base md:text-lg font-medium leading-6
                  outline-none hover:text-white hover:border-b-2
                  hover:border-[#ff1464] text-[#8a809e] border-b-2
                  border-transparent cursor-pointer transition-all duration-200 ease-in-out"
              >
                Strategic Members
              </span>
            </Link>
            <Link href="#enterprise-sec">
              <span
                className="px-3 py-2 text-base md:text-lg font-medium leading-6
                  outline-none hover:text-white hover:border-b-2
                  hover:border-[#ff1464] text-[#8a809e] border-b-2
                  border-transparent cursor-pointer transition-all duration-200 ease-in-out"
              >
                Enterprise Members
              </span>
            </Link>
            <Link href="#participant-sec">
              <span
                className="px-3 py-2 text-base md:text-lg font-medium leading-6
                  outline-none hover:text-white hover:border-b-2
                  hover:border-[#ff1464] text-[#8a809e] border-b-2
                  border-transparent cursor-pointer transition-all duration-200 ease-in-out"
              >
                Participant Members
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Logos
        sectionId="strategic-sec"
        members={LogoType.STRATEGIC}
        title="Strategic Members"
        description="Companies that use Eclipse Temurin in production."
      />

      <Logos
        sectionId="enterprise-sec"
        members={LogoType.ENTERPRISE}
        title="Enterprise Members"
        description="Companies that use Eclipse Temurin in production."
      />

      <Logos
        sectionId="participant-sec"
        members={LogoType.PARTICIPANT}
        title="Participant Members"
        description="Companies that use Eclipse Temurin in production."
      />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8 my-12 px-4">
        <p className="text-[20px] leading-[28px] text-white my-0 text-center">
          Are you interested in becoming a member?
        </p>
        <Link href="/join" className="w-full sm:w-auto">
          <button className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            Become a Member
          </button>
        </Link>
      </div>

      <ContactUs
        title="Speak to our team today"
        buttontitle="Contact Us"
        linkTo="/join"
      />
    </div>
  )
}
