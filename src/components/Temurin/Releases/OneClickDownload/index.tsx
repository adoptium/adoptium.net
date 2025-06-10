"use client"

import React from "react"
import { ReleaseAsset } from "@/types/temurin"
import { TemurinReleaseAssets } from "@/hooks/fetchTemurinReleases"
import { FaWindows, FaApple } from "react-icons/fa"
import { BsDownload } from "react-icons/bs"

interface OneClickDownloadProps {
    selectedVersion: string
    releases: ReleaseAsset[] | TemurinReleaseAssets
}

const OneClickDownload: React.FC<OneClickDownloadProps> = ({
    selectedVersion,
    releases,
}) => {
    // Only show if we have releases
    if (!releases.length) {
        return null
    }

    // Find first release to get version info
    const firstRelease = releases[0]
    const versionFormatted = firstRelease ? firstRelease.release_name : selectedVersion

    // Find macOS download link for the latest ARM (M1) package
    let macOSLink = "#"
    let macOSDisplay = `Temurin ${versionFormatted}`
    let macOSIsInstaller = false

    // Find Windows download link for the latest x64 MSI package
    let windowsLink = "#"
    let windowsDisplay = `Temurin ${versionFormatted}`
    let windowsIsInstaller = false

    // Track what we've found to prioritize appropriately
    let foundMacOSArm = false;
    let foundMacOSX64 = false;
    let foundWindowsX64 = false;

    // Also track JDK vs JRE to prioritize JDK
    let macOSArmJDK = false;
    let macOSX64JDK = false;
    let windowsX64JDK = false;

    // Search for appropriate releases
    releases.forEach(release => {
        // Look for macOS ARM builds
        if (release.os === "mac" && release.architecture === "aarch64") {
            release.binaries.forEach(binary => {
                // First try to find PKG installers
                if (binary.installer_link) {
                    // If we haven't found any macOS ARM build yet, or if this is a JDK and previous wasn't
                    if (!foundMacOSArm || (binary.type === "JDK" && !macOSArmJDK)) {
                        macOSLink = binary.installer_link
                        macOSDisplay = `Temurin ${versionFormatted}, macOS aarch64 (M1) (.PKG)`
                        foundMacOSArm = true
                        macOSArmJDK = binary.type === "JDK"
                        macOSIsInstaller = true
                    }
                }
                // Fallback to archive files if no installer
                else if (!macOSIsInstaller && binary.extension && binary.link) {
                    // If we haven't found any macOS ARM build yet, or if this is a JDK and previous wasn't
                    if (!foundMacOSArm || (binary.type === "JDK" && !macOSArmJDK)) {
                        macOSLink = binary.link
                        macOSDisplay = `Temurin ${versionFormatted}, macOS aarch64 (M1) (.${binary.extension.toUpperCase()})`
                        foundMacOSArm = true
                        macOSArmJDK = binary.type === "JDK"
                    }
                }
            })
        }

        // Look for macOS x64 builds
        if (release.os === "mac" && release.architecture === "x64") {
            release.binaries.forEach(binary => {
                // First try to find PKG installers
                if (binary.installer_link) {
                    // If we haven't found any macOS x64 build yet, or if this is a JDK and previous wasn't
                    if (!foundMacOSX64 || (binary.type === "JDK" && !macOSX64JDK)) {
                        // Only set if we haven't found ARM or if this is a JDK and ARM isn't
                        if (!foundMacOSArm || (binary.type === "JDK" && !macOSArmJDK)) {
                            macOSLink = binary.installer_link
                            macOSDisplay = `Temurin ${versionFormatted}, macOS x64 (.PKG)`
                            foundMacOSX64 = true
                            macOSX64JDK = binary.type === "JDK"
                            macOSIsInstaller = true
                        }
                    }
                }
                // Fallback to archive files if no installer and we don't have ARM
                else if (!macOSIsInstaller && binary.extension && binary.link) {
                    // If we haven't found any macOS x64 build yet, or if this is a JDK and previous wasn't
                    if (!foundMacOSX64 || (binary.type === "JDK" && !macOSX64JDK)) {
                        // Only set if we haven't found ARM or if this is a JDK and ARM isn't
                        if (!foundMacOSArm || (binary.type === "JDK" && !macOSArmJDK)) {
                            macOSLink = binary.link
                            macOSDisplay = `Temurin ${versionFormatted}, macOS x64 (.${binary.extension.toUpperCase()})`
                            foundMacOSX64 = true
                            macOSX64JDK = binary.type === "JDK"
                        }
                    }
                }
            })
        }

        // Look for Windows x64 builds
        if (release.os === "windows" && release.architecture === "x64") {
            release.binaries.forEach(binary => {
                // First try to find MSI installers
                if (binary.installer_link) {
                    // If we haven't found any Windows x64 build yet, or if this is a JDK and previous wasn't
                    if (!foundWindowsX64 || (binary.type === "JDK" && !windowsX64JDK)) {
                        windowsLink = binary.installer_link
                        windowsDisplay = `Temurin ${versionFormatted}, Windows 64 bit (.MSI)`
                        foundWindowsX64 = true
                        windowsX64JDK = binary.type === "JDK"
                        windowsIsInstaller = true
                    }
                }
                // Fallback to archive files if no installer
                else if (!windowsIsInstaller && binary.extension && binary.link) {
                    // If we haven't found any Windows x64 build yet, or if this is a JDK and previous wasn't
                    if (!foundWindowsX64 || (binary.type === "JDK" && !windowsX64JDK)) {
                        windowsLink = binary.link
                        windowsDisplay = `Temurin ${versionFormatted}, Windows 64 bit (.${binary.extension.toUpperCase()})`
                        foundWindowsX64 = true
                        windowsX64JDK = binary.type === "JDK"
                    }
                }
            })
        }
    })

    return (
        <div className="flex justify-between flex-col md:flex-row w-full items-center gap-8 max-w-[1264px] mx-auto">
            {/* macOS Download Card */}
            <div className="p-8 bg-[#200E46] justify-between w-full border rounded-[24px] border-[#564873] h-[264px] flex flex-col transition-all duration-300 ease-in-out hover:border-primary shadow-[0_2px_4px_rgba(255,20,100,0.2)]">
                <span className="p-6 rounded-full w-fit bg-[#2B1A4F] border border-[#5A4D76]">
                    <FaApple size={30} />
                </span>
                <div className="flex justify-between items-center gap-8">
                    <div className="flex flex-col space-y-2">
                        <h4 className="text-4xl font-semibold">macOS</h4>
                        <h5 className="text-base font-normal text-grey">{macOSDisplay}</h5>
                    </div>
                    <span className="p-3 group cursor-pointer rounded-full w-fit bg-[#2B1A4F] border border-[#5A4D76] hover:border-primary transition-all duration-300 ease-in-out">
                        <a href={macOSLink} aria-label="Download macOS package">
                            <BsDownload size={25} />
                        </a>
                    </span>
                </div>
            </div>

            {/* Windows Download Card */}
            <div className="p-8 bg-[#200E46] justify-between w-full border rounded-[24px] border-[#564873] h-[264px] flex flex-col transition-all duration-300 ease-in-out hover:border-primary shadow-[0_2px_4px_rgba(255,20,100,0.2)]">
                <span className="p-6 rounded-full w-fit bg-[#2B1A4F] border border-[#5A4D76]">
                    <FaWindows size={30} />
                </span>
                <div className="flex justify-between items-center gap-8">
                    <div className="flex flex-col space-y-2">
                        <h4 className="text-4xl font-semibold">Windows</h4>
                        <h5 className="text-base font-normal text-grey">{windowsDisplay}</h5>
                    </div>
                    <span className="p-3 group cursor-pointer rounded-full w-fit bg-[#2B1A4F] border border-[#5A4D76] hover:border-primary transition-all duration-300 ease-in-out">
                        <a href={windowsLink} aria-label="Download Windows package">
                            <BsDownload size={25} />
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default OneClickDownload
