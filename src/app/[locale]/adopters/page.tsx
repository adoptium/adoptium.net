import { Metadata } from "next"
import React from "react"
import PageHeader from "@/components/Common/PageHeader"
import BecomeAdopter from "@/components/BecomeAdopter"
import ContactUs from "@/components/ContactUs"
import Logos, { LogoType } from "@/components/Logos"

export const metadata: Metadata = {
    title: "Our Adopters",
    description: "View the companies that use Eclipse Temurin in production.",
}

export default function AdoptersPage() {
    return (
        <div>
            <PageHeader
                title="Eclipse Temurin™ Adopters"
                subtitle="Our Adopters"
                description="Companies that use Eclipse Temurin in production."
            />
            <Logos
                members={LogoType.ADOPTERS}
                title=""
                description=""
            />
            <BecomeAdopter />
            <ContactUs
                title="Speak to our team today"
                buttontitle="Contact Us"
                linkTo="/join" />
        </div>
    )
}
