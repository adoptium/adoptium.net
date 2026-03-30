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

export default function JoinUsPage() {
    return (
        <div>
            <PageHeader
                title="Join us in securing the future of your critical technologies"
                subtitle="Join Us"
                description="Eclipse Adoptium is building world-class, open, enterprise-ready Java runtimes. By joining our community, you will drive the evolution of Eclipse Temurin, ensuring it remains secure, high-performance, and freely accessible for millions of Java users worldwide."
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
