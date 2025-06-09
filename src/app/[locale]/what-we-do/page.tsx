import React from "react"
import { Metadata } from "next"
import PageHeader from "@/components/Common/PageHeader"
import WGProjects from "@/components/WGProjects"
import ContactUs from "@/components/ContactUs"
import WaysToSupport from "@/components/WaysToSupport"
import Testimonials from "@/components/Testimonials"
import LatestNews from '@/components/News/LatestNews';

export const metadata: Metadata = {
  title: "What We Do",
  description: "Adoptium champions open-source Java solutions, empowering businesses with cutting-edge technology and collaborative innovation.",
}

export default function WhatWeDoPage() {
  return (
    <>
      <PageHeader
        title="About Eclipse Adoptium®"
        subtitle="What we do"
        description={
          <div className="text-center lg:text-justify flex flex-col ml-10 gap-3">
            <p>
              Adoptium champions open-source Java solutions, empowering
              businesses with cutting-edge technology and collaborative
              innovation.
            </p>
            <p>
              Founded on the principles of community-driven development,
              Adoptium has become a cornerstone of the Java ecosystem, driving
              forward-thinking solutions and fostering a culture of shared
              knowledge.
            </p>
            <p>
              We achieve this through a set of Projects under the Adoptium PMC
              and a close working partnership with external projects, most
              notably OpenJDK for providing the Java SE runtime implementation.
            </p>
            <p>
              The AdoptOpenJDK project was established in 2017 following years
              of discussions about the general lack of an open and reproducible
              build and test system for OpenJDK source across multiple
              platforms. Since then it has grown to become a leading provider of
              high-quality OpenJDK-based binaries used by enterprises in
              embedded systems, desktops, traditional servers, modern cloud
              platforms, and large mainframes. The Eclipse Adoptium project is
              the continuation of the original AdoptOpenJDK mission.
            </p>
          </div>
        }
      />
      <WGProjects />
      <WaysToSupport />
      <ContactUs
        title="Connect with the community"
        buttontitle="Learn More"
        description="Join our Slack channel to discuss work and reach out to project maintainers."
        linkTo="/slack" 
      />
      <Testimonials />
      <LatestNews />
    </>
  )
}
