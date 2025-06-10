"use client"

import React, { useState } from "react"
import { loadLatestAssets } from "@/hooks"
import PageHeader from "@/components/Common/PageHeader"
import Tabs from "@/components/Temurin/Tabs"
import CommonCtaWrapper from "@/components/Common/CommonCtaWrapper"
import DownloadMethods from "@/components/Temurin/DownloadMethods"
import ChecksumModal from "@/components/ChecksumModal"

export default function TemurinReleasesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentChecksum, setCurrentChecksum] = useState("")

  interface OpenModalWithChecksum {
    (checksum: string): void
  }

  const openModalWithChecksum: OpenModalWithChecksum = (checksum: string) => {
    setCurrentChecksum(checksum)
    setModalOpen(true)
  }

  return (
    <div>
      <PageHeader
        title={"Download Temurin&reg JDK"}
        subtitle={"Latest Releases"}
        description={
          "Pick a version, package type, JDK/JRE, and download the binaries."
        }
      />
      <Tabs
        updaterAction={loadLatestAssets}
        Table={CommonCtaWrapper}
        openModalWithChecksum={openModalWithChecksum}
      />
      <DownloadMethods />
      {/* <FAQ className={"!py-16 md:!py-24"} /> */}
      <ChecksumModal
        open={modalOpen}
        setOpen={setModalOpen}
        checksum={currentChecksum}
      />
    </div>
  )
}
