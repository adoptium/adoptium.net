import { Metadata } from "next"
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases"
import TemurinNightlyPageClient from "./TemurinNightlyPageClient"

export const metadata: Metadata = {
    title: "Nightly Builds",
    description: "Java™ is the world's leading programming language and platform. The Adoptium Marketplace promotes high-quality, TCK certified and AQAvit verified runtimes for use across the Java ecosystem.",
}

export default async function TemurinNightlyPage() {
    const availableReleases = await fetchAvailableReleases()
    const allVersions = availableReleases.available_releases.map((version: number) => {
        const isLTS = availableReleases.available_lts_releases.includes(version)
        return {
            name: isLTS ? `${version} - LTS` : version.toString(),
            value: version.toString(),
        }
    })
    // Add nightly EA version if not already present
    if (!allVersions.some(v => v.value === availableReleases.most_recent_feature_version.toString())) {
        allVersions.unshift({
            name: `${availableReleases.most_recent_feature_version} - EA`,
            value: availableReleases.most_recent_feature_version.toString(),
        })
    }
    const latestLTS = availableReleases.most_recent_lts

    return (
        <TemurinNightlyPageClient
            allVersions={allVersions}
            latestLTS={latestLTS}
        />
    )
}
