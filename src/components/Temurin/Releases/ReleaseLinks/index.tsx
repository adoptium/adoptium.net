"use client"

import React from "react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ReleaseAsset } from "@/types/temurin"
import { TemurinReleaseAssets } from "@/hooks/fetchTemurinReleases"
import { FaRegFileCode } from "react-icons/fa"
import { GrNotes, GrInstall } from "react-icons/gr";
import { GiFlatPlatform } from "react-icons/gi";

interface ReleaseLinksProps {
    selectedVersion: string
    releases: ReleaseAsset[] | TemurinReleaseAssets
}

const ReleaseLinks: React.FC<ReleaseLinksProps> = ({
    selectedVersion,
    releases,
}) => {
    const t = useTranslations("Temurin.Releases.ReleaseLinks")
    // Only show if we have releases
    if (!releases.length) {
        return null
    }

    // Find first release to get version info
    let releaseNotesUrl = "/temurin/release-notes"
    if (typeof releases === "object" && "source" in releases && releases.source) {
        releaseNotesUrl = `/temurin/release-notes/?version=${releases.source.release_name}`
    }

    // Prepare links
    const installationGuideUrl = "/installation"
    const supportedPlatformsUrl = "/supported-platforms"

    // Find source code link if available
    let sourceCodeUrl = "#"

    // Source can be in a special property added by the loadLatestAssets function
    if (releases && 'source' in releases && releases.source) {
        const sourceRelease = releases.source
        if (sourceRelease?.binary?.package) {
            sourceCodeUrl = sourceRelease.binary.package.link
        }
    }

    // For older JDK versions where no direct source link is available
    // We construct a GitHub source URL based on the version
    if (sourceCodeUrl === "#") {
        const vNum = parseInt(selectedVersion, 10)
        if (!isNaN(vNum)) {
            sourceCodeUrl = `https://github.com/adoptium/temurin${vNum}-binaries`
        }
    }

    return (
        <section className="w-full max-w-[1264px] mx-auto" data-testid="release-links-section">
            <ul className="flex md:flex-row flex-col gap-4 lg:gap-8 items-start w-full justify-start sm:justify-center sm:items-center my-8" data-testid="release-links-list">
                <Link href={releaseNotesUrl}>
                    <li className="flex gap-3 group items-center text-white hover:text-primary transition-all duration-300 ease-in-out text-xl font-normal cursor-pointer" data-testid="release-notes-link">
                        <span className="group">
                            <GrNotes />
                        </span>
                        {t('release-notes')}
                    </li>
                </Link>

                <Link href={installationGuideUrl}>
                    <li className="flex gap-3 group items-center text-white hover:text-primary transition-all duration-300 ease-in-out text-xl font-normal cursor-pointer" data-testid="installation-guide-link">
                        <span className="group">
                            <GrInstall />
                        </span>
                        {t('installation-guide')}
                    </li>
                </Link>

                <Link href={supportedPlatformsUrl}>
                    <li className="flex gap-3 group items-center text-white hover:text-primary transition-all duration-300 ease-in-out text-xl font-normal cursor-pointer" data-testid="supported-platforms-link">
                        <span className="group">
                            <GiFlatPlatform />
                        </span>
                        {t('supported-platforms')}
                    </li>
                </Link>

                <Link href={sourceCodeUrl} target="_blank">
                    <li className="flex gap-3 group items-center text-white hover:text-primary transition-all duration-300 ease-in-out text-xl font-normal cursor-pointer" data-testid="source-code-link">
                        <span className="group">
                            <FaRegFileCode />
                        </span>
                        {t('source-code')}
                    </li>
                </Link>
            </ul>
        </section>
    )
}

export default ReleaseLinks
