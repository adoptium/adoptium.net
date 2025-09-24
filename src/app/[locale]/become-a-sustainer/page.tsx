"use client"
import React, { useState } from 'react';
import PageHeader from "@/components/Common/PageHeader"
import HubspotForm from "@/components/HubspotForm"

export default function BecomeSustainerPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const pageDescription = isSubmitted 
        ? "Thank you for submitting the Eclipse Temurin Sustainer form. We appreciate your interest in supporting the Adoptium Working Group."
        : "Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem.";

    return (
        <div>
            <PageHeader
                subtitle="Sustainer"
                title="Become a Sustainer"
                description={pageDescription}
            />
            <section className="mx-auto max-w-4xl w-full p-6 lg:px-0 items-center justify-center">
                <HubspotForm
                    portalId="5413615"
                    formId="6e3e994e-5bc8-4a6e-91b3-d3f331b69402"
                    onFormSubmit={() => setIsSubmitted(true)}
                />
            </section>
        </div>
    )
}