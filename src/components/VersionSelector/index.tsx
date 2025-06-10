"use client"

import React from "react"
import { setURLParam } from "@/utils/setURLParam"

interface VersionSelectorProps {
  activeVersionTab: number | string
  setActiveVersionTab: (tab: number | string) => void
  versions: Array<{ name: string, value: number }>
  updateVersion: (version: number | string) => void
  defaultVersion: string
  updateOS?: (os: string) => void
  updateArch?: (arch: string) => void
}

const VersionSelector: React.FC<VersionSelectorProps> = ({
  activeVersionTab,
  setActiveVersionTab,
  versions,
  updateVersion,
  updateOS,
  updateArch,
}) => {
  // Handle tab selection with proper URL and state updates
  const handleTabClick = (newTab: number | string) => {
    // Notify parent of tab change
    setActiveVersionTab(newTab)

    // If All Versions tab is clicked (tab 1)
    if (newTab === 1) {
      // For All Versions tab, we'll preserve the current version
      // Don't need to update version in URL, parent component will handle this

      // Reset OS and arch to "any"
      setURLParam("os", "any")
      if (updateOS) updateOS("any")
      setURLParam("arch", "any")
      if (updateArch) updateArch("any")
    }
    // If specific version tab is clicked
    else {
      // Update version parameter
      setURLParam("version", newTab)
      updateVersion(newTab)

      // Reset OS and arch to "any"
      setURLParam("os", "any")
      if (updateOS) updateOS("any")
      setURLParam("arch", "any")
      if (updateArch) updateArch("any")
    }
  }

  return (
    <div className="w-full max-w-[1264px] mx-auto ">
      <div className="relative min-w-full w-full overflow-auto md:overflow-visible">
        <span className="h-[1px] w-full bg-[#3E3355] inline-block absolute bottom-0 z-[-1]"></span>
        <div className="flex space-x-10 whitespace-nowrap lg:justify-center py-3">
          <button onClick={() => handleTabClick(1)}>
            <span
              className={`py-3 w-full text-base font-normal leading-6 
            outline-none cursor-pointer transition-all duration-200 ease-in-out ${activeVersionTab === 1 ? "border-primary border-b-[2px] text-white" : "text-[#8a809e] border-transparent border-b"}`}
            >
              All Versions
            </span>
          </button>
          {versions.map((version, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(version.value)}
            >
              <span
                className={`py-3 w-full text-base font-normal leading-6
            outline-none cursor-pointer transition-all duration-200 ease-in-out ${activeVersionTab === version.value ? "border-primary border-b-[2px] text-white" : "text-[#8a809e] border-transparent border-b"}`}
              >
                JDK {version.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VersionSelector