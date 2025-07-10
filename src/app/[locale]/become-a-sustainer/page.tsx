import { Metadata } from 'next'
import PageHeader from "@/components/Common/PageHeader"
import HubspotForm from "@/components/HubspotForm"

export const metadata: Metadata = {
    title: 'Become a Sustainer',
    description: 'Become a Sustainer of Eclipse Temurin to support the development and maintenance of high-performance, cross-platform, open-source Java runtime binaries.',
}

export default function BecomeSustainerPage() {
    return (
        <div>
            <PageHeader
                subtitle="Sustainer"
                title="Become a Sustainer"
                description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
            />
            <section className="mx-auto max-w-4xl w-full p-6 lg:px-0 items-center justify-center">
                <HubspotForm
                    portalId="5413615"
                    formId="6e3e994e-5bc8-4a6e-91b3-d3f331b69402"
                />
            </section>
        </div>
    )
}
