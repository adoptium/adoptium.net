import { Metadata } from "next"
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases"
import TemurinReleasesPage from "./releases-client"

export const metadata: Metadata = {
  title: "Latest Releases",
  description: "Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem.",
}

export default async function ReleasesPage() {
  const availableReleases = await fetchAvailableReleases()
  return <TemurinReleasesPage availableReleases={availableReleases} />
}
