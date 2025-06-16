import { Metadata } from "next"
import React from "react"
import PageHeader from "@/components/Common/PageHeader"
import WaysToSupport from "@/components/Support/WaysToSupport"
import MediaAndPromotion from "@/components/Support/MediaAndPromotion"
import ContactUs from "@/components/ContactUs"

export const metadata: Metadata = {
    title: "Support Us",
    description: "Learn how you can support the Eclipse Adoptium community.",
}

export default function SupportUsPage() {
    return (
        <div>
            <PageHeader
                title="What we’re trying to achieve"
                subtitle="Support Us"
                description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
                className={"max-w-[860px] mx-auto"}
            />
            <WaysToSupport />
            <MediaAndPromotion />
            <ContactUs
                title="Connect with the community"
                buttontitle="Learn More"
                description="Join our Slack channel to discuss work and reach out to project maintainers."
                linkTo="/slack"
            />
        </div>
    )
}
