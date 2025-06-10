"use client"

import React, { useState } from "react"
import { FaApple, FaWindows, FaRedo } from "react-icons/fa"
import { FcLinux } from "react-icons/fc"
import { SiAlpinelinux } from "react-icons/si"
import { AixIcon, SolarisIcon } from "@/components/Common/Icon"
import OSSelector from "@/components/Common/OSSelector"
import CommonDownloader from "@/components/Common/CommonDownloader"
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder"
import { defaultPackageType } from "@/utils/defaults"
import { ReleaseAsset } from "@/types/temurin"

interface Architecture {
  release_name: string
  release_date: string
  binaries: ReleaseAsset['binaries']
}

interface OSData {
  os: string
  architectures: Record<string, Architecture>
}

interface ActiveArchitectures {
  [key: string]: string
}

interface SelectedPackageType {
  [key: string]: string
}

interface CommonCtaWrapperProps {
  results: ReleaseAsset[]
  openModalWithChecksum: (checksum: string) => void
  onReset?: () => void
}

const osIcons = {
  windows: FaWindows,
  mac: FaApple,
  "alpine-linux": SiAlpinelinux,
  linux: FcLinux,
  aix: AixIcon,
  solaris: SolarisIcon,
}

const CommonCtaWrapper: React.FC<CommonCtaWrapperProps> = ({
  results,
  openModalWithChecksum,
  onReset,
}) => {
  const [activeArchitectures, setActiveArchitectures] =
    useState<ActiveArchitectures>({})
  const [selectedPackageType, setSelectedPackageType] =
    useState<SelectedPackageType>({})

  if (!results || !Array.isArray(results)) {
    return (
      <div className="max-w-[1264px] space-y-8 w-full pb-16 md:pb-32 mx-auto px-6 xl:px-0">
        {/* Create 3 skeleton cards for the loading state */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex justify-between border flex-wrap border-[#554772] rounded-[24px] !bg-[#200E46] items-start p-6 lg:p-8 animate-pulse"
          >
            <div className="w-full lg:w-[45%] flex flex-col">
              <AnimatedPlaceholder>
                <div className="p-6 bg-[#2B1A4F] flex flex-col rounded-[24px] gap-6">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 justify-start items-center">
                      <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                      <div className="h-6 bg-gray-600 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-6 bg-gray-600 rounded w-16 animate-pulse"></div>
                      <div className="h-6 bg-gray-600 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              </AnimatedPlaceholder>
            </div>
            <div className="flex flex-col w-full lg:w-[50%] mt-8 lg:mt-0">
              <div className="h-6 bg-gray-600 rounded w-48 mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-16 bg-gray-600 rounded-xl animate-pulse"></div>
                <div className="h-16 bg-gray-600 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // No results state with reset option
  if (results.length === 0) {
    return (
      <div className="max-w-[1264px] w-full pb-16 md:pb-32 mx-auto px-6 xl:px-0">
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
              <h3 className="text-2xl font-semibold text-white">No releases found</h3>
              <p className="text-gray-400 leading-relaxed">
                No releases match your current filter criteria. Try adjusting your selections or reset all filters to see available releases.
              </p>
            </div>
            {onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25"
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

  const handlePackageTypeChange = (os: string, newType: string): void => {
    setSelectedPackageType((prevTypes: SelectedPackageType) => ({
      ...prevTypes,
      [os]: newType,
    }))
  }

  const osData = results.reduce<Record<string, OSData>>((acc, item) => {
    const osKey = item.os
    if (!acc[osKey]) {
      acc[osKey] = {
        os: item.os,
        architectures: {},
      }
    }

    if (!acc[osKey].architectures[item.architecture]) {
      acc[osKey].architectures[item.architecture] = {
        release_name: item.release_name,
        release_date: item.release_date,
        binaries: [],
      }
    }

    acc[osKey].architectures[item.architecture].binaries.push(...item.binaries)

    return acc
  }, {})

  const handleArchitectureChange = (os: string, arch: string): void => {
    setActiveArchitectures({ ...activeArchitectures, [os]: arch })
  }

  return (
    <div className="max-w-[1264px] space-y-8 w-full pb-16 md:pb-32 mx-auto px-6 xl:px-0 rounded-[24px] border-white">
      {Object.entries(osData).map(([os, data]) => {
        const IconComponent = osIcons[os as keyof typeof osIcons] || FcLinux
        const activeArch =
          activeArchitectures[os] || Object.keys(data.architectures)[0] // Default to the first architecture
        const archData = data.architectures[activeArch]

        return (
          <div
            key={os}
            className="flex justify-between border flex-wrap border-[#554772] rounded-[24px] !bg-[#200E46] items-start p-6 lg:p-8"
          >
            <div className="w-full lg:w-[45%] flex flex-col">
              <OSSelector
                operatingSystem={os}
                svgComponent={<IconComponent size={30} />}
                activeIndex={activeArch}
                onActiveChange={arch => handleArchitectureChange(os, arch)}
                onPackageTypeChange={newType =>
                  handlePackageTypeChange(os, newType)
                }
                buttons={Object.keys(data.architectures).map(arch => ({
                  label: arch,
                  active: arch === activeArch,
                }))}
              />
            </div>
            <div className="flex flex-col w-full lg:w-[50%] mt-8 lg:mt-0">
              <h5 className="pb-6 border-b-[1px] text-2xl font-semibold border-[#3E3355]">
                {`Temurin ${archData.release_name} - ${new Date(archData.release_date).toLocaleDateString()}`}
              </h5>
              {archData.binaries
                .filter(
                  binary =>
                    binary.type ===
                    (selectedPackageType[os]?.toUpperCase() ||
                      defaultPackageType.toUpperCase()),
                )
                .map((binary, index) => (
                  <React.Fragment key={index}>
                    <CommonDownloader
                      openModalWithChecksum={openModalWithChecksum}
                      obj={{
                        label: `${binary.extension.toUpperCase()}, ${binary.size}Mb`,
                        link: binary.link,
                        os: os,
                        arch: activeArch || "",
                        pkg_type: binary.type,
                        java_version: archData.release_name,
                        checksum: binary.checksum,
                      }}
                    />
                    {binary.installer_link &&
                      binary.type ===
                      (selectedPackageType[os]?.toUpperCase() ||
                        defaultPackageType.toUpperCase()) && (
                        <CommonDownloader
                          openModalWithChecksum={openModalWithChecksum}
                          obj={{
                            label: `${binary.installer_extension && binary.installer_extension.toUpperCase()}, ${binary.installer_size}Mb`,
                            link: binary.installer_link || "",
                            os: os,
                            arch: activeArch || "",
                            pkg_type: binary.type,
                            java_version: archData.release_name,
                            checksum: binary.installer_checksum || "",
                          }}
                        />
                      )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommonCtaWrapper
