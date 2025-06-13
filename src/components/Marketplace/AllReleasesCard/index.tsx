"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { BsCopy } from "react-icons/bs"
import { FiDownload } from "react-icons/fi"
import { FaRedo } from "react-icons/fa"
import ChecksumModal from "@/components/ChecksumModal"
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder"
import type { MarketplaceRelease } from "@/hooks"

import { capitalize } from "@/utils/capitalize"
import { getImageForDistribution } from "@/hooks"
import { fetchExtension } from "@/utils/fetchExtension"

interface AllReleaseCardProps {
    results: MarketplaceRelease[] | null
    onReset?: () => void
}

const AllReleaseCard: React.FC<AllReleaseCardProps> = ({ results, onReset }) => {
    const t = useTranslations()
    const locale = useLocale();
    const [modalOpen, setModalOpen] = useState(false)
    const [currentChecksum, setCurrentChecksum] = useState("")

    interface OpenModalWithChecksum {
        (checksum: string): void
    }

    const openModalWithChecksum: OpenModalWithChecksum = (checksum) => {
        setCurrentChecksum(checksum)
        setModalOpen(true)
    }

    // Loading state with sleek animated placeholders
    if (results === null) {
        return (
            <div className="mt-8">
                <div className="grid gap-4">
                    {/* Create 3 skeleton cards for the loading state */}
                    {[1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#200E46]/90 via-[#2B1A4F]/80 to-[#200E46]/90 backdrop-blur-sm border border-[#200E46]/50"
                        >
                            <div className="p-6">
                                <AnimatedPlaceholder>
                                    {/* Desktop Layout Skeleton */}
                                    <div className="hidden md:flex items-center justify-between">
                                        <div className="flex items-center flex-1">
                                            <div className="w-[140px] flex-shrink-0">
                                                <div className="h-5 bg-[#200E46]/60 rounded w-20 animate-pulse"></div>
                                            </div>
                                            <div className="w-[140px] flex-shrink-0 px-2">
                                                <div className="h-4 bg-[#200E46]/60 rounded w-24 animate-pulse"></div>
                                            </div>
                                            <div className="w-[140px] flex-shrink-0 flex justify-center px-2">
                                                <div className="w-20 h-14 bg-[#200E46]/60 rounded-xl animate-pulse"></div>
                                            </div>
                                            <div className="w-[120px] flex-shrink-0 px-2 space-y-1">
                                                <div className="h-3 bg-[#200E46]/60 rounded w-16 animate-pulse"></div>
                                                <div className="h-4 bg-[#200E46]/60 rounded w-20 animate-pulse"></div>
                                            </div>
                                            <div className="w-[100px] flex-shrink-0 px-2 space-y-1">
                                                <div className="h-3 bg-[#200E46]/60 rounded w-8 animate-pulse"></div>
                                                <div className="h-4 bg-[#200E46]/60 rounded w-16 animate-pulse"></div>
                                            </div>
                                            <div className="w-[100px] flex-shrink-0 px-2 space-y-1">
                                                <div className="h-3 bg-[#200E46]/60 rounded w-8 animate-pulse"></div>
                                                <div className="h-4 bg-[#200E46]/60 rounded w-12 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                            <div className="h-10 bg-[#200E46]/60 rounded-lg w-24 animate-pulse"></div>
                                            <div className="h-10 bg-[#200E46]/60 rounded-lg w-32 animate-pulse"></div>
                                        </div>
                                    </div>

                                    {/* Mobile Layout Skeleton */}
                                    <div className="block md:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <div className="h-5 bg-[#200E46]/60 rounded w-24 animate-pulse"></div>
                                                <div className="h-4 bg-[#200E46]/60 rounded w-20 animate-pulse"></div>
                                            </div>
                                            <div className="w-24 h-16 bg-[#200E46]/60 rounded-xl animate-pulse"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="h-3 bg-[#200E46]/60 rounded w-16 animate-pulse"></div>
                                                    <div className="h-4 bg-[#200E46]/60 rounded w-20 animate-pulse"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <div className="flex-1 h-10 bg-[#200E46]/60 rounded-lg animate-pulse"></div>
                                            <div className="flex-1 h-10 bg-[#200E46]/60 rounded-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                </AnimatedPlaceholder>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // No results state with reset option
    if (results && results.length === 0) {
        return (
            <div className="mt-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#2B1A4F] to-[#3E3355] rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold text-white">No distributions found</h3>
                            <p className="text-gray-400 leading-relaxed">
                                No Java distributions match your current filter criteria. Try adjusting your selections or reset all filters to see available distributions.
                            </p>
                        </div>
                        {onReset && (
                            <button
                                onClick={onReset}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF1464] to-[#FF1464]/90 hover:from-[#FF1464]/90 hover:to-[#FF1464] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-[#FF1464]/25"
                            >
                                <FaRedo className="w-4 h-4" />
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-8">
            <ChecksumModal open={modalOpen} setOpen={setModalOpen} checksum={currentChecksum} />

            {/* Modern Grid Layout */}
            <div className="grid gap-4">
                {results.map((release, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#200E46]/90 via-[#2B1A4F]/80 to-[#200E46]/90 backdrop-blur-sm border border-[#200E46]/50 hover:border-[#FF1464]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF1464]/10 hover:transform hover:scale-[1.02]"
                    >
                        {/* Subtle gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF1464]/5 to-[#FF1464]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Mobile Layout */}
                        <div className="block md:hidden space-y-4">
                            <div className="relative p-6">
                                {/* Header with version and vendor logo */}
                                <div className="flex items-center justify-between min-h-[4.5rem]"> {/* min-h for vertical centering */}
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            {release.release_name}
                                        </h3>
                                        <p className="text-sm text-slate-300">
                                            {capitalize(release.binary.distribution)}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center h-full">
                                        <div className="w-24 h-16 bg-white rounded-xl p-2.5 shadow-xl ring-2 ring-[#FF1464]/20 flex items-center justify-center">
                                            <Image
                                                className="w-full h-full object-contain drop-shadow-sm"
                                                alt={`${release.binary.distribution} logo`}
                                                src={getImageForDistribution(release.binary.distribution)}
                                                width={64}
                                                height={64}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="space-y-1">
                                        <span className="text-slate-300">{t("Marketplace.Releases.build-date")}</span>
                                        <p className="text-white font-medium">
                                            {new Date(release.binary.timestamp).toLocaleDateString(locale, {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-300">OS</span>
                                        <p className="text-white font-medium">
                                            {capitalize(release.binary.os)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-300">{t("Temurin.Releases.ReleaseFilters.architecture")}</span>
                                        <p className="text-white font-medium">
                                            {release.binary.architecture}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-300">{t("Marketplace.Releases.vendor")}</span>
                                        <p className="text-white font-medium">
                                            {release.vendor}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons - Grouped Design */}
                                <div className="bg-[#200E46]/60 backdrop-blur-sm rounded-xl p-3 border border-[#200E46]/40">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModalWithChecksum(release.binary.package.sha256sum)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#200E46]/80 hover:bg-[#200E46]/90 border border-[#FF1464]/20 hover:border-[#FF1464]/40 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#FF1464]/20"
                                            aria-label="View checksum"
                                        >
                                            <BsCopy className="w-4 h-4" />
                                            {t("Temurin.Releases.ReleaseResults.checksum")}
                                        </button>
                                        <a
                                            href={typeof release.binary.package.link === 'string' ? release.binary.package.link : release.binary.package.link.toString()}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF1464] to-[#FF1464]/90 hover:from-[#FF1464]/90 hover:to-[#FF1464] rounded-lg text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FF1464]/30 hover:transform hover:scale-105"
                                        >
                                            <FiDownload className="w-4 h-4" />
                                            {t("Marketplace.Releases.download")} ({fetchExtension(release.binary.package.name)})
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:flex items-center justify-between min-h-[6rem] p-4">
                            <div className="flex items-center flex-1 min-h-[6rem]">
                                {/* Version */}
                                <div className="w-[140px] flex-shrink-0">
                                    <h3 className="text-lg font-bold text-white truncate">
                                        {release.release_name}
                                    </h3>
                                </div>

                                {/* Distribution */}
                                <div className="w-[140px] flex-shrink-0 px-2">
                                    <p className="text-white font-semibold truncate">
                                        {capitalize(release.binary.distribution)}
                                    </p>
                                </div>

                                {/* Vendor Logo - More Prominent */}
                                <div className="w-[140px] flex-shrink-0 flex justify-center px-2">
                                    <div className="w-20 h-14 bg-white rounded-xl p-2.5 shadow-xl ring-2 ring-[#FF1464]/20 hover:ring-[#FF1464]/40 transition-all duration-200">
                                        <Image
                                            className="w-full h-full object-contain drop-shadow-sm"
                                            alt={`${release.binary.distribution} logo`}
                                            src={getImageForDistribution(release.binary.distribution)}
                                            width={64}
                                            height={64}
                                        />
                                    </div>
                                </div>

                                {/* Build Date */}
                                <div className="w-[120px] flex-shrink-0 px-2">
                                    <span className="text-xs text-slate-300 block">{t("Marketplace.Releases.build-date")}</span>
                                    <p className="text-sm text-white font-medium truncate">
                                        {new Date(release.binary.timestamp).toLocaleDateString(locale, {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                {/* OS */}
                                <div className="w-[100px] flex-shrink-0 px-2">
                                    <span className="text-xs text-slate-300 block">OS</span>
                                    <p className="text-sm text-white font-medium truncate">
                                        {capitalize(release.binary.os)}
                                    </p>
                                </div>

                                {/* Architecture */}
                                <div className="w-[100px] flex-shrink-0 px-2">
                                    <span className="text-xs text-slate-300 block">{t("Temurin.Releases.ReleaseFilters.architecture")}</span>
                                    <p className="text-sm text-white font-medium truncate">
                                        {release.binary.architecture}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons - Grouped Design */}
                            <div className="bg-[#200E46]/40 backdrop-blur-sm rounded-xl p-3 border border-[#200E46]/30">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openModalWithChecksum(release.binary.package.sha256sum)}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#200E46]/80 hover:bg-[#200E46]/90 border border-[#FF1464]/20 hover:border-[#FF1464]/40 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#FF1464]/20"
                                        aria-label="View checksum"
                                    >
                                        <BsCopy className="w-4 h-4" />
                                        {t("Temurin.Releases.ReleaseResults.checksum")}
                                    </button>
                                    <a
                                        href={typeof release.binary.package.link === 'string' ? release.binary.package.link : release.binary.package.link.toString()}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#FF1464] to-[#FF1464]/90 hover:from-[#FF1464]/90 hover:to-[#FF1464] rounded-lg text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FF1464]/30 hover:transform hover:scale-105"
                                    >
                                        <FiDownload className="w-4 h-4" />
                                        {t("Marketplace.Releases.download")} ({fetchExtension(release.binary.package.name)})
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllReleaseCard
