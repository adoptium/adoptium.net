import { Metadata } from "next"
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases"
import MarketplacePageClient from "./MarketplacePageClient"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Java™ is the world's leading programming language and platform. The Adoptium Marketplace promotes high-quality, TCK certified and AQAvit verified runtimes for use across the Java ecosystem.",
}

export default async function MarketplacePage() {
  const availableReleases = await fetchAvailableReleases()
  const ltsVersions = availableReleases.available_lts_releases.map((version: number) => ({
    name: version.toString(),
    value: version.toString(),
  }))
  const latestLTS = availableReleases.most_recent_lts

  return (
    <MarketplacePageClient ltsVersions={ltsVersions} latestLTS={latestLTS} />
  )
}
