import { Metadata } from "next";
import React from "react";
import { Link } from "@/i18n/navigation";
import Program from "@/components/Sustainers/Program";
import KeyInitiatives from "@/components/Sustainers/KeyInitiatives";
import SavingsCalculator from "@/components/Sustainers/SavingsCalculator";
import SustainerLevels from "@/components/Sustainers/Levels";
import Logos, { LogoType } from "@/components/Logos";
import PageHeader from "@/components/Common/PageHeader";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Sustainers",
  description: "Support the Adoptium project and become a Sustainer",
};

const initiatives = [
  {
    header: "Enhanced Security",
    image: "security.svg",
    description:
      "Contribute to rigorous security practices, including regular audits and vulnerability management. Your support ensures the continuation of our Secure Development efforts, encompassing SBOM, reproducible builds, SLSA, OpenChain Conformance, security audits, and vulnerability reports.",
  },
  {
    header: "Faster Release Cycles",
    image: "release.svg",
    description:
      "Ensure your Java environments stay up-to-date with the latest advancements by sponsoring additional infrastructure services. This support will enable us to publish feature and CPU releases within our ambitious delivery targets, keeping your systems at the forefront of innovation.",
  },
  {
    header: "Ready-to-deploy Builds",
    image: "deploy.svg",
    description:
      "Ensure access to Java versions tailored to your specific architecture and operating system needs. Get the precise build for your software services and save money by avoiding the costs of creating your own builds. Your funding allows us to deliver across a broad range of platforms and architectures",
  },
  {
    header: "Sustained Innovation",
    image: "innovation.svg",
    description:
      "Support the continuous improvement of Temurin and other Adoptium projects. We are leaders in Secure Development, Quality Assurance, Migration Tools, and many other areas where we have been developing bleeding-edge, innovative solutions. Your funding allows us to continue to develop improvements that benefit the entire Java ecosystem.",
  },
  {
    header: "Quality Testing",
    image: "testing.svg",
    description:
      "Help us maintain and optimize our testing infrastructure across all necessary platforms and versions, ensuring robust and reliable releases. Your funding allows us to assess and include tests that your organization cares about and proactively discover and mitigate defects before they land in your domain.",
  },
  {
    header: "Community Development and Engagement",
    image: "community.svg",
    description:
      "Support the growth of a diverse and vibrant Java community. Your sponsorship helps maintain and enhance Adoptium projects, ensuring a stable, scalable, and interoperable Java ecosystem. Additionally, you will have the opportunity to support events and marketing initiatives and actively participating in community activities, spreading awareness and fostering collaboration.",
  },
];

export default function SustainersPage() {
  const headerButtons = (
    <>
      <Link
        href="https://www.eclipse.org/sponsor/adoptium/?scope=website&campaign=become-sustainer"
        className="w-full sm:w-auto cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="cursor-pointer w-full px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
          Become an individual Sustainer
        </button>
      </Link>
      <Link href="/become-a-sustainer" className="w-full sm:w-auto cursor-pointer">
        <button className="cursor-pointer w-full px-8 py-4 rounded-full border-2 border-white text-white hover:bg-pink-500 hover:text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2">
          Become a corporate Sustainer
        </button>
      </Link>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Join us in strengthening the future of Eclipse Temurin"
        subtitle="Become a Corporate Sustainer"
        buttons={headerButtons}
      />

      <div className="w-full flex flex-col justify-center items-center pt-[240px] md:pt-[120px]">
        <Program />
        <KeyInitiatives
          initiatives={initiatives}
          title="How Your Support Fuels Key Initiatives"
        />
        <p className="text-[16px] text-[#c4bfce] p-6 max-w-[900px] text-center mx-auto mt-6 leading-relaxed">
          Join the Eclipse Temurin Sustainer Program and play a crucial role in
          maintaining the vitality and reliability of the world&apos;s
          fastest-growing open source Java SE runtime. Your support accelerates
          our initiatives, driving greater impact and innovation within the Java
          ecosystem.
        </p>
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
          <div className="mt-16">
            <Testimonials type="sustainer" />
          </div>
        </div>
      </div>
    </div>
  );
}
