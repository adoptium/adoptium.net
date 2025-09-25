import { Metadata } from 'next'
import PageHeader from "@/components/Common/PageHeader"
import PlatformMatrix from "@/components/Support/PlatformMatrix"
import ContactUs from "@/components/ContactUs"

export const metadata: Metadata = {
    title: 'Temurin™ Supported Platforms',
    description: 'View the supported platforms for Eclipse Temurin, the high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested.',
}

export default function SupportedPlatformsPage() {
    return (
        <div>
            <PageHeader
                subtitle="Eclipse Temurin"
                title="Supported Platforms"
                description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
                className={"mx-auto max-w-[860px] px-2 w-full"}
            />
            <PlatformMatrix />
            {/* <ReleaseRoadmap /> */}
            <ContactUs
                title="Connect with the community"
                buttontitle="Learn More"
                description="Join our Slack channel to discuss work and reach out to project maintainers."
                linkTo="/slack"
                className={"md:py-28 py-12"}
            />
            {/* <div className="py-10">
          <DocumentationGrid />
        </div> */}
        </div>
    )
}
