"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import ReleaseNotesRender from "@/components/ReleaseNotesRender"
import ReleaseNotesVersionSelector from "@/components/ReleaseNotesVersionSelector"

interface AvailableReleases {
  available_lts_releases: number[]
  available_releases: number[]
  most_recent_feature_release: number
  most_recent_feature_version: number
  most_recent_lts: number
  tip_version: number
}

interface ReleaseNotesPageClientProps {
  availableReleases: AvailableReleases
}

const ReleaseNotesPageClient: React.FC<ReleaseNotesPageClientProps> = ({
  availableReleases
}) => {
  const searchParams = useSearchParams()
  const version = searchParams.get("version")

  // If no version is specified, show the version selector
  if (!version) {
    return (
      <ReleaseNotesVersionSelector 
        availableVersions={availableReleases.available_releases}
        availableLTSVersions={availableReleases.available_lts_releases}
      />
    )
  }

  // If a version is specified, show the release notes
  return <ReleaseNotesRender />
}

export default ReleaseNotesPageClient
