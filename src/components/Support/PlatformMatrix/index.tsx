"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { FaDocker } from "react-icons/fa"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { LiaTimesSolid } from "react-icons/lia"
import { HiChevronDown } from "react-icons/hi2"
import platformSupportDataRaw from "@/data/supported-platforms.json"

const platformSupportData: { platforms: Platform[] } = platformSupportDataRaw

interface VersionInfo {
    supported: boolean;
    docker: boolean;
}

interface Distro {
    name: string;
    versions: Record<string, VersionInfo>;
}

interface Platform {
    category: string;
    distros: Distro[];
    footnotes?: string[];
}

const PlatformMatrix = () => {
    const t = useTranslations("Temurin.Releases.ReleaseFilters")
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const handleToggleFaq = (index: number) => {
        setOpenFaq(prevOpenFaq => (prevOpenFaq === index ? null : index))
    }

    const isEven = (n: number) => {
        return n % 2 == 0
    }

    // Helper function to render text with clickable links
    const renderTextWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g
        const parts = text.split(urlRegex)

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-300 hover:text-pink-200 underline transition-colors duration-200"
                    >
                        {part}
                    </a>
                )
            }
            return part
        })
    }

    return (
        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-12 md:pb-14 lg:pb-28 lg:pt-16">
            <div className="text-center">
                <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
                    This section lists the operating systems that are supported with the
                    latest release of Eclipse Temurin.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 lg:gap-8 items-center py-6 md:py-8 lg:py-12 px-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 w-full sm:w-auto justify-center sm:justify-start">
                    <IoMdCheckmarkCircleOutline size={20} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Supported</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 w-full sm:w-auto justify-center sm:justify-start">
                    <FaDocker size={20} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Docker Available</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 w-full sm:w-auto justify-center sm:justify-start">
                    <LiaTimesSolid size={20} className="text-red-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Not Supported</span>
                </div>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="hidden md:grid md:grid-cols-6 gap-6 p-6 md:p-8 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10">
                    <div className="text-lg font-semibold text-white/90">
                        {t("operating-system")}
                    </div>
                    {Array.from(
                        new Set(
                            platformSupportData.platforms.flatMap((platform: Platform) =>
                                platform.distros.flatMap((distro: Distro) =>
                                    Object.keys(distro.versions)
                                )
                            )
                        )
                    ).sort((a: string, b: string) => Number(a) - Number(b))
                        .map((version: string) => (
                            <div key={version} className="text-lg font-semibold text-white/90 text-center">
                                JDK {version}
                            </div>
                        ))}
                </div>

                <div className="md:hidden bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10">
                    <div className="p-4">
                        <h4 className="text-lg font-semibold text-white/90 mb-3 text-center">
                            {t("operating-system")}
                        </h4>
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {platformSupportData.platforms.map((platform, index) => (
                        <div key={index} className="group">
                            <button
                                onClick={() => handleToggleFaq(index)}
                                className="w-full flex items-center justify-between p-4 md:p-6 lg:p-8 bg-gradient-to-r from-transparent to-transparent hover:from-white/5 hover:to-transparent transition-all duration-300 focus:outline-none focus:from-white/10 focus:to-white/5 min-h-[60px] md:min-h-auto"
                            >
                                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white group-hover:text-pink-300 transition-colors duration-300 text-left">
                                    {platform.category}
                                </h3>
                                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 flex-shrink-0">
                                    <HiChevronDown
                                        size={18}
                                        className={`text-white/70 transition-all duration-300 md:w-5 md:h-5 ${openFaq === index ? "rotate-180 text-pink-300" : "rotate-0"
                                            }`}
                                    />
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-out ${openFaq === index
                                    ? "max-h-[2000px] opacity-100"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                {openFaq === index && (
                                    <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
                                        {/* Footnotes section */}
                                        {platform.footnotes && platform.footnotes.length > 0 && (
                                            <div className="my-4 p-4 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-500/20 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                                                    <div className="text-pink-100/90 text-sm leading-relaxed">
                                                        {platform.footnotes.map((footnote: string, index: number) => (
                                                            <div key={index} className={index > 0 ? 'mt-2' : ''}>
                                                                {renderTextWithLinks(footnote)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="hidden md:block bg-gradient-to-br from-black/20 to-black/10 rounded-2xl border border-white/5 overflow-hidden">
                                            {platform.distros.map((distro, distroIndex) => (
                                                <div
                                                    key={distroIndex}
                                                    className={`grid grid-cols-6 gap-6 p-4 md:p-6 transition-all duration-200 hover:bg-white/5 ${isEven(distroIndex) ? "bg-white/2" : "bg-transparent"
                                                        }`}
                                                >
                                                    <div className="flex items-center">
                                                        <span className="text-white/90 font-medium text-sm md:text-base">
                                                            {distro.name}
                                                        </span>
                                                    </div>
                                                    {Object.entries(distro.versions).map(
                                                        ([, { supported, docker }], versionIndex) => (
                                                            <div
                                                                key={versionIndex}
                                                                className="flex items-center justify-center gap-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {supported ? (
                                                                        <div className="p-1 rounded-full bg-emerald-500/20">
                                                                            <IoMdCheckmarkCircleOutline
                                                                                size={18}
                                                                                className="text-emerald-400"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="p-1 rounded-full bg-red-500/20">
                                                                            <LiaTimesSolid
                                                                                size={18}
                                                                                className="text-red-400"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {docker && (
                                                                        <div className="p-1 rounded-full bg-blue-500/20">
                                                                            <FaDocker size={16} className="text-blue-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Mobile view - card layout */}
                                        <div className="md:hidden space-y-4">
                                            {platform.distros.map((distro, distroIndex) => (
                                                <div
                                                    key={distroIndex}
                                                    className="bg-gradient-to-br from-black/20 to-black/10 rounded-2xl border border-white/5 p-4"
                                                >
                                                    <h4 className="text-white/90 font-semibold text-base mb-4">
                                                        {distro.name}
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {Object.entries(distro.versions).map(
                                                            ([version, { supported, docker }], versionIndex) => (
                                                                <div
                                                                    key={versionIndex}
                                                                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                                                                >
                                                                    <span className="text-white/80 text-sm font-medium">
                                                                        JDK {version}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        {supported ? (
                                                                            <div className="p-1 rounded-full bg-emerald-500/20">
                                                                                <IoMdCheckmarkCircleOutline
                                                                                    size={16}
                                                                                    className="text-emerald-400"
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="p-1 rounded-full bg-red-500/20">
                                                                                <LiaTimesSolid
                                                                                    size={16}
                                                                                    className="text-red-400"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {docker && (
                                                                            <div className="p-1 rounded-full bg-blue-500/20">
                                                                                <FaDocker size={14} className="text-blue-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlatformMatrix