import { Metadata } from 'next'
import PageHeader from "@/components/Common/PageHeader"
import HubspotForm from "@/components/HubspotForm"

export const metadata: Metadata = {
    title: 'Join',
    description: 'Join the Eclipse Adoptium Working Group to contribute to the development and maintenance of high-performance, cross-platform, open-source Java runtime binaries.',
}

export default function JoinWGPage() {
    return (
        <div>
            <PageHeader
                subtitle="Join the Eclipse Adoptium&reg; Working Group"
                title="Joining the Working Group"
                description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
            />
            <section className="joinForm mx-auto max-w-4xl w-full p-6 lg:px-0 items-center justify-center">
                <HubspotForm
                    portalId="5413615"
                    formId="78aa6887-715f-420c-97be-b97860899cec"
                />
            </section>
        </div>
    )
}
