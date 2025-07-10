import React from "react"
import { Metadata } from "next"
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases"
import TemurinPageClient from "./TemurinPageClient"

export const metadata: Metadata = {
  title: "Eclipse Temurin",
  description: "Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem.",
}

export default async function TemurinPage() {
  const availableReleases = await fetchAvailableReleases()
  const latestLTS = availableReleases.most_recent_lts;
  return (
    <TemurinPageClient latestLTS={latestLTS} />
  )
}
