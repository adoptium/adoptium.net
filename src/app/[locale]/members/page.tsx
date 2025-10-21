import React from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/Common/PageHeader";
import ContactUs from "@/components/ContactUs";
import Logos, { LogoType } from "@/components/Logos";
import KeyInitiatives from "@/components/Sustainers/KeyInitiatives";
import MembershipLevels from "@/components/MembershipLevels";
import CommonButton from "@/components/Common/CommonButton";

export const metadata: Metadata = {
  title: "Become a Member",
  description:
    "View the members of the Eclipse Adoptium community, including strategic, enterprise, and participant members who use Eclipse Temurin in production.",
};

const initiatives = [
  {
    header: "Lead the Future of Java",
    image: "lead.svg",
    description: (
      <>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>
            Define the technical vision and shape the roadmap of the most widely
            adopted OpenJDK builds.
          </li>
          <li>
            Influence strategic decisions on default settings, security
            responses, and platform configurations.
          </li>
          <li>
            Align project priorities with your own by contributing to test
            suites, developer engagement, version support, and key metrics.
          </li>
        </ul>
      </>
    ),
  },
  {
    header: "Strengthen Your Open Source Strategy",
    image: "strengthen.svg",
    description: (
      <>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>
            Join a global, innovative open source ecosystem committed to
            improving Java for enterprise use.
          </li>
          <li>
            Benefit from stable licensing, predictable development frameworks,
            and open collaboration.
          </li>
          <li>
            Gain the support of a thriving community to evolve your open source
            practices.
          </li>
        </ul>
      </>
    ),
  },
  {
    header: "Rely on Open, Vendor-Neutral Governance",
    image: "governance.svg",
    description: (
      <>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>
            Trust in transparent, community-led governance under the Eclipse
            Foundation.
          </li>
          <li>
            Ensure long-term stability and vendor neutrality to avoid lock-in
            and reduce operational risk.
          </li>
        </ul>
      </>
    ),
  },
  {
    header: "Join the Leaders Driving Java Forward",
    image: "community.svg",
    description: (
      <>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>
            Collaborate with leading Java vendors like Microsoft, Red Hat, IBM,
            Google, Alibaba, and Rivos.
          </li>
          <li>
            Ensure your enterprise use cases shape the future quality standards
            of Java.
          </li>
          <li>
            Engage directly with OpenJDK distributors to guide development and
            distribution.
          </li>
        </ul>
      </>
    ),
  },
  {
    header: "Cut Costs and Share Infrastructure",
    image: "cut.svg",
    description: (
      <>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>
            Share infrastructure costs and reduce duplication across build,
            test, and release pipelines.
          </li>
          <li>
            Improve delivery speed and operational efficiency through shared
            systems and practices.
          </li>
        </ul>
      </>
    ),
  },
  {
    header: "Define the Narrative for Open Java",
    image: "narrative.svg",
    description: (
      <>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>
            Shape the messaging, content, and marketing of Adoptium projects.
          </li>
          <li>
            Contribute to how Java is positioned for global enterprises and
            developer communities.
          </li>
        </ul>
      </>
    ),
  },
];

export default function MembersPage() {
  const headerButtons = (
    <>
      <Link href="/join" className="w-full sm:w-auto">
        <CommonButton>Join Us</CommonButton>
      </Link>
      <Link href="#strategic-sec" className="w-full sm:w-auto">
        <CommonButton>Our Members</CommonButton>
      </Link>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Join the Adoptium Working Group"
        subtitle="Become a Member"
        description="Support the future of open, secure, enterprise-ready Java runtimes."
        buttons={headerButtons}
      />
      <KeyInitiatives
        initiatives={initiatives}
        title="Why Join Adoptium?"
        description="The Adoptium Working Group brings together organizations to shape the future of Java by collaborating on the delivery of high-quality, TCK-certified OpenJDK binaries through Eclipse Temurin. As a member, your organization gains strategic influence, community leadership opportunities, and a voice in driving long-term innovation across the Java ecosystem."
      />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8 my-12 px-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/join">
            <CommonButton>Contact Us</CommonButton>
          </Link>
          {/* TODO add a real link */}
          {/* <Link href="">
            <CommonButton>Download Prospectus</CommonButton>
          </Link> */}
        </div>
      </div>

      <MembershipLevels
        title="Membership Levels"
        description="Choose the membership level that best fits your organization's needs and engagement with the Adoptium community."
      />

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
        // description="Strategic Members are organizations that view Adoptium working group managed technology as critical to their organization’s future, and are investing significant resources to sustain and define the core activities that are the responsibility of the working group."
      />

      <Logos
        sectionId="enterprise-sec"
        members={LogoType.ENTERPRISE}
        title="Enterprise Members"
        // description="Enterprise Members are typically organizations that view the Adoptium working group managed technology as a critical part of their organization‘s business operations. These organizations want to influence the direction and support the development of a runtime technology ecosystem through Eclipse Adoptium."
      />

      <Logos
        sectionId="participant-sec"
        members={LogoType.PARTICIPANT}
        title="Participant Members"
        // description="Participant Members are typically organizations that deliver products or services based on Adoptium technology. These organizations want to participate in the evolution of the Eclipse Adoptium ecosystem to ensure it continues to meet their needs."
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
  );
}
