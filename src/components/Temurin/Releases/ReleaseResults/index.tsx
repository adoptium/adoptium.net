"use client"

import React, { useState } from "react"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { sendDownloadEvent } from '@/utils/gtag'
import { ReleaseAsset } from "@/types/temurin"
import { FaWindows, FaApple } from "react-icons/fa"
import { FcLinux } from "react-icons/fc"
import { SiAlpinelinux } from "react-icons/si"
import { AixIcon, SolarisIcon } from "@/components/Common/Icon"
import { BsCopy, BsDownload } from "react-icons/bs"
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder"
import { MdVerifiedUser } from "react-icons/md"

interface ReleaseResultsProps {
    releases: ReleaseAsset[]
    isLoading: boolean
    openModalWithChecksum: (checksum: string) => void
}

const osIcons = {
    windows: FaWindows,
    mac: FaApple,
    "alpine-linux": SiAlpinelinux,
    linux: FcLinux,
    aix: AixIcon,
    solaris: SolarisIcon,
}

const ReleaseResults: React.FC<ReleaseResultsProps> = ({
    releases,
    isLoading,
    openModalWithChecksum,
}) => {
    const t = useTranslations("Temurin.Releases.ReleaseResults");
    const locale = useLocale();
    // Track selected architecture for each OS
    const [selectedArchitectures, setSelectedArchitectures] = useState<Record<string, string>>({});

    // Track selected package type (jdk/jre) for each OS+arch combination
    const [selectedPackageTypes, setSelectedPackageTypes] = useState<Record<string, string>>({});

    // Show loading state
    if (isLoading) {
        return (
            <section className="py-4" data-testid="release-results-loading">
                <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className="flex justify-between border flex-wrap border-[#554772] rounded-[16px] !bg-[#200E46] items-start p-4 lg:p-5 animate-pulse"
                            data-testid={`loading-skeleton-${index}`}
                        >
                            <div className="w-full lg:w-[45%] flex flex-col">
                                <AnimatedPlaceholder>
                                    <div className="p-4 bg-[#2B1A4F] flex flex-col rounded-[16px] gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-3 justify-start items-center">
                                                <div className="w-6 h-6 bg-gray-600 rounded-full animate-pulse"></div>
                                                <div className="h-5 bg-gray-600 rounded w-20 animate-pulse"></div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-5 bg-gray-600 rounded w-14 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="h-8 bg-gray-600 rounded-full animate-pulse"></div>
                                    </div>
                                </AnimatedPlaceholder>
                            </div>
                            <div className="flex flex-col w-full lg:w-[50%] mt-6 lg:mt-0">
                                <div className="h-5 bg-gray-600 rounded w-48 mb-4 animate-pulse"></div>
                                <div className="space-y-3">
                                    <div className="h-12 bg-gray-600 rounded-xl animate-pulse"></div>
                                    <div className="h-12 bg-gray-600 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    // No results found
    if (releases.length === 0) {
        return (
            <section className="py-8" data-testid="release-results-empty">
                <div className="flex justify-center items-center min-h-[400px] border border-[#554772] rounded-[24px] bg-[#200E46] p-8">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#2B1A4F] to-[#3E3355] rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-testid="empty-state-icon"
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
                            <h3 className="text-2xl font-semibold text-white" data-testid="empty-state-title">{t('no-releases-found')}</h3>
                            <p className="text-gray-400 leading-relaxed" data-testid="empty-state-description">
                                {t('no-releases-found-description')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // Process data for better rendering
    const groupedReleases = releases.reduce<Record<string, Record<string, ReleaseAsset[]>>>(
        (acc, release) => {
            const { os } = release
            if (!acc[os]) {
                acc[os] = {}
            }

            const { architecture } = release
            if (!acc[os][architecture]) {
                acc[os][architecture] = []
            }

            acc[os][architecture].push(release)
            return acc
        },
        {}
    )

    // Select an architecture for a specific OS
    const handleArchSelection = (os: string, arch: string) => {
        setSelectedArchitectures(prev => ({
            ...prev,
            [os]: arch
        }));
    };

    // Handle package type selection for a specific OS+arch combination
    const handlePackageTypeSelection = (os: string, arch: string, packageType: string) => {
        const key = `${os}-${arch}`;
        setSelectedPackageTypes(prev => ({
            ...prev,
            [key]: packageType
        }));
    };

    // Get the currently selected package type for an OS+arch
    const getPackageType = (os: string, arch: string) => {
        const key = `${os}-${arch}`;
        // Default to 'jdk' if nothing is selected for this OS/arch
        return selectedPackageTypes[key] || 'jdk';
    };

    // Define the preferred order for OS display
    const osOrder = ['linux', 'windows', 'mac', 'alpine-linux', 'aix', 'solaris'];

    // Sort the OS entries according to the preferred order
    const sortedOSEntries = Object.entries(groupedReleases).sort(([osA], [osB]) => {
        const indexA = osOrder.indexOf(osA);
        const indexB = osOrder.indexOf(osB);

        // If OS not in order list, put it at the end
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });

    return (
        <section className="py-4" data-testid="release-results-content">
            <div className="space-y-4">
                {sortedOSEntries.map(([os, architectures]) => {
                    const IconComponent = osIcons[os as keyof typeof osIcons] || FcLinux;
                    const architectureList = Object.keys(architectures);

                    // Default to the first architecture or use the selected one
                    const selectedArch = selectedArchitectures[os] || architectureList[0];
                    const releaseGroup = architectures[selectedArch] || [];

                    return (
                        <div
                            key={os}
                            className="flex justify-between border flex-wrap border-[#554772] rounded-[24px] !bg-[#200E46] items-start p-4 lg:p-6"
                            data-testid={`release-card-${os}`}
                        >
                            <div className="w-full lg:w-[45%] flex flex-col">
                                <div>
                                    <div className="p-4 bg-[#2B1A4F] flex flex-col rounded-[24px] gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 justify-start items-center">
                                                <IconComponent size={30} />
                                                <h5 className="text-2xl font-semibold leading-[32px]" data-testid={`os-title-${os}`}>
                                                    {os === "mac" ? "macOS" : os.charAt(0).toUpperCase() + os.slice(1)}
                                                </h5>
                                            </div>

                                            <div className="flex gap-4" data-testid={`architecture-tabs-${os}`}>
                                                {/* Architecture selector tabs */}
                                                {architectureList.map(arch => (
                                                    <button
                                                        key={arch}
                                                        onClick={() => handleArchSelection(os, arch)}
                                                        data-testid={`arch-tab-${os}-${arch}`}
                                                    >
                                                        <span className={`py-2 w-full text-base font-normal leading-6 
                              outline-hidden cursor-pointer transition-all duration-200 ease-in-out ${selectedArch === arch
                                                                ? "border-primary border-b-[2px] text-white"
                                                                : "text-[#8a809e] border-transparent border-b"
                                                            }`}
                                                        >
                                                            {arch}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Package type selector buttons */}
                                        <div className="flex gap-2 mt-1" data-testid={`package-type-buttons-${os}-${selectedArch}`}>
                                            <button
                                                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${getPackageType(os, selectedArch) === "jdk"
                                                    ? "border-[#FF1464] text-[#FF1464] bg-[#2B1A4F]"
                                                    : "border-gray-500 text-gray-300 hover:border-gray-300"
                                                    }`}
                                                onClick={() => handlePackageTypeSelection(os, selectedArch, "jdk")}
                                                data-testid={`jdk-button-${os}-${selectedArch}`}
                                            >
                                                JDK
                                            </button>
                                            <button
                                                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${getPackageType(os, selectedArch) === "jre"
                                                    ? "border-[#FF1464] text-[#FF1464] bg-[#2B1A4F]"
                                                    : "border-gray-500 text-gray-300 hover:border-gray-300"
                                                    }`}
                                                onClick={() => handlePackageTypeSelection(os, selectedArch, "jre")}
                                                data-testid={`jre-button-${os}-${selectedArch}`}
                                            >
                                                JRE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full lg:w-[50%] mt-8 lg:mt-0">
                                {/* Release details header */}
                                <h5 className="pb-6 border-b-[1px] text-2xl font-semibold border-[#3E3355]" data-testid={`release-header-${os}`}>
                                    {`Temurin ${releaseGroup[0]?.release_name || ""} - ${releaseGroup[0]?.release_date
                                        ? new Date(releaseGroup[0].release_date).toLocaleDateString(locale, {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : ""
                                        }`}
                                </h5>

                                {/* File download rows */}
                                {releaseGroup.flatMap(release =>
                                    release.binaries
                                        .filter(binary =>
                                            getPackageType(os, selectedArch) === "any" ||
                                            binary.type.toLowerCase() === getPackageType(os, selectedArch).toLowerCase()
                                        )
                                        .map((binary, idx) => (
                                            <div
                                                key={`${release.os}-${release.architecture}-${binary.type}-${idx}`}
                                                className="text-white w-[100%] py-6 border-b-[1px] border-[#3E3355]"
                                                data-testid={`binary-row-${release.os}-${release.architecture}-${binary.type}-${idx}`}
                                            >
                                                <div className="flex justify-between w-full items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="cursor-pointer group">
                                                            <Link
                                                                href={{
                                                                    pathname: "/download",
                                                                    query: {
                                                                        link: binary.link,
                                                                        vendor: "Adoptium",
                                                                    }
                                                                }}
                                                                onClick={() => sendDownloadEvent({
                                                                    link: binary.link,
                                                                    os: release.os,
                                                                    arch: release.architecture,
                                                                    pkg_type: binary.type,
                                                                    version: release.release_name,
                                                                    vendor: "temurin"
                                                                })}
                                                                data-testid={`download-link-${release.os}-${release.architecture}-${binary.type}-${idx}`}
                                                            >
                                                                <BsDownload size={20} />
                                                            </Link>
                                                        </span>
                                                        <h5 className="text-base font-normal" data-testid={`binary-info-${release.os}-${release.architecture}-${binary.type}-${idx}`}>
                                                            {`${binary.extension.toUpperCase()}, ${binary.size} MB`}
                                                        </h5>

                                                        {/* Certification indicators */}
                                                        <MdVerifiedUser
                                                            size={30}
                                                            style={{ color: "rgb(83, 127, 185)" }}
                                                            data-toggle="tooltip"
                                                            data-placement="bottom"
                                                            title={t('this-build-is-jck-certified')}
                                                        />
                                                        <Link href="/aqavit/">
                                                            <Image
                                                                src="/images/icons/aqavit-icon.png"
                                                                width="25"
                                                                height="25"
                                                                alt="AQAvit logo"
                                                                data-toggle="tooltip"
                                                                data-placement="bottom"
                                                                title={t('this-build-is-aqavit-verified')}
                                                                className="img-fluid mb-0"
                                                            />
                                                        </Link>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="cursor-pointer group">
                                                            <a href="#" onClick={(e) => {
                                                                e.preventDefault();
                                                                if (binary.checksum) {
                                                                    openModalWithChecksum(binary.checksum);
                                                                }
                                                            }} data-testid={`checksum-link-${release.os}-${release.architecture}-${binary.type}-${idx}`}>
                                                                <BsCopy size={20} />
                                                            </a>
                                                        </span>
                                                        <h5 className="text-base font-normal">{t('checksum')}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}

                                {/* Installer files if available */}
                                {releaseGroup.flatMap(release =>
                                    release.binaries
                                        .filter(binary =>
                                            binary.installer_link && (
                                                getPackageType(os, selectedArch) === "any" ||
                                                binary.type.toLowerCase() === getPackageType(os, selectedArch).toLowerCase()
                                            )
                                        )
                                        .map((binary, idx) => (
                                            <div
                                                key={`${release.os}-${release.architecture}-${binary.type}-installer-${idx}`}
                                                className="text-white w-[100%] py-6 border-b-[1px] border-[#3E3355]"
                                            >
                                                <div className="flex justify-between w-full items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="cursor-pointer group">
                                                            <Link
                                                                href={{
                                                                    pathname: "/download",
                                                                    query: {
                                                                        link: binary.installer_link,
                                                                        vendor: "Adoptium",
                                                                    }
                                                                }}
                                                                onClick={() => sendDownloadEvent({
                                                                    link: binary.installer_link || '',
                                                                    os: release.os,
                                                                    arch: release.architecture,
                                                                    pkg_type: 'installer',
                                                                    version: release.release_name,
                                                                    vendor: "temurin"
                                                                })}
                                                            >
                                                                <BsDownload size={20} />
                                                            </Link>
                                                        </span>
                                                        <h5 className="text-base font-normal">
                                                            {`${binary.installer_extension?.toUpperCase() || 'INSTALLER'}, ${binary.installer_size} MB`}
                                                        </h5>

                                                        {/* Certification indicators */}
                                                        <MdVerifiedUser
                                                            size={30}
                                                            style={{ color: "rgb(83, 127, 185)" }}
                                                            data-toggle="tooltip"
                                                            data-placement="bottom"
                                                            title={t('this-build-is-jck-certified')}
                                                        />
                                                        <Link href="/aqavit/">
                                                            <Image
                                                                src="/images/icons/aqavit-icon.png"
                                                                width="25"
                                                                height="25"
                                                                alt="AQAvit logo"
                                                                data-toggle="tooltip"
                                                                data-placement="bottom"
                                                                title="This build is AQAvit Verified"
                                                                className="img-fluid mb-0"
                                                            />
                                                        </Link>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="cursor-pointer group">
                                                            <a href="#" onClick={(e) => {
                                                                e.preventDefault();
                                                                if (binary.installer_checksum) {
                                                                    openModalWithChecksum(binary.installer_checksum);
                                                                }
                                                            }}>
                                                                <BsCopy size={20} />
                                                            </a>
                                                        </span>
                                                        <h5 className="text-base font-normal">{t('checksum')}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ReleaseResults;
