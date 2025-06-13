import React from "react"
import { Metadata } from "next"
import { useTranslations } from "next-intl"
import PageHeader from "@/components/Common/PageHeader"
import ReleaseNotesRender from "@/components/ReleaseNotesRender"

export const metadata: Metadata = {
    title: "Release Notes",
    description: "Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem.",
}

export default function TemurinPage() {
    const t = useTranslations("ReleaseNotes")

    return (
        <div>
            <PageHeader
                subtitle="Temurin"
                title={t('title')}
                description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
                className="mx-auto max-w-[860px] px-2 w-full"
            />
            <ReleaseNotesRender />
        </div>
    )
}