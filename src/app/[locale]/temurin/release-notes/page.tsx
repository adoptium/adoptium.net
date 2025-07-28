import React from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases"
import PageHeader from "@/components/Common/PageHeader"
import ReleaseNotesPageClient from "./ReleaseNotesPageClient"

export const metadata: Metadata = {
    title: "Release Notes",
    description: "Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem.",
}

export default async function TemurinPage() {
    const t = await getTranslations('ReleaseNotes')
    const availableReleases = await fetchAvailableReleases()

    return (
        <div data-testid="temurin-release-notes-page">
            <PageHeader
                subtitle="Temurin"
                title={t('title')}
                description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
                className="mx-auto max-w-[860px] px-2 w-full"
            />
            <ReleaseNotesPageClient availableReleases={availableReleases} />
        </div>
    )
}