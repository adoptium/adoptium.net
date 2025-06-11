"use client"

import React, { useEffect, useState } from "react"
import { setURLParam } from "@/utils/setURLParam"
import { useOses, useArches } from '@/hooks/fetchConstants'
import CommonSelector from "@/components/Common/CommonSelector"
import { FaUndo } from "react-icons/fa"

interface ReleaseFiltersProps {
    onFiltersChange: (version: string, os: string, arch: string) => void
    initialParams: Record<string, string>
}

const ReleaseFilters: React.FC<ReleaseFiltersProps> = ({ onFiltersChange, initialParams }) => {
    // State for dropdown values
    const [version, setVersion] = useState<string>("any")
    const [os, setOS] = useState("any")
    const [arch, setArch] = useState("any")

    // Available options
    const [versionOptions, setVersionOptions] = useState<Array<{ name: string; value: string }>>([])
    const [latestLTS, setLatestLTS] = useState(21)

    // Get OS and architecture options from hooks
    const osOptions = useOses(true)
    const architectureOptions = useArches(true)

    // Fetch available versions on component mount
    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const response = await fetch('/api/available-releases')
                const data = await response.json()

                if (data.most_recent_lts) {
                    setLatestLTS(data.most_recent_lts)
                }

                const allVersions = []

                // Then add non-LTS versions
                if (data.available_releases && Array.isArray(data.available_releases)) {
                    const versions = data.available_releases
                        .map((v: { name: string; value: number | string }) => ({
                            name: `JDK ${v.name}`,
                            value: String(v.value)
                        }))

                    allVersions.push(...versions)
                }

                setVersionOptions(allVersions)
            } catch (error) {
                console.error("Failed to fetch available versions:", error)
            }
        }

        fetchVersions()
    }, [])

    // Initialize filters from URL parameters - this runs only once after version options are loaded
    useEffect(() => {
        // Wait until version options are loaded (including the LTS info)
        if (versionOptions.length === 0) return;

        // Don't set URL params during initialization, just update local state
        let initialVersion = String(latestLTS);
        let initialOS = "any";
        let initialArch = "any";

        // Initialize version
        if (initialParams.version) {
            // Handle special cases
            if (initialParams.version === "latest") {
                // For backward compatibility, use latest LTS
                initialVersion = String(latestLTS);
                // Update URL to use actual version number instead of "latest"
                setTimeout(() => {
                    setURLParam("version", initialVersion);
                }, 0);
            } else if (initialParams.version === "any") {
                // "any" is no longer a valid option, fall back to latest LTS
                initialVersion = String(latestLTS);
                // Update URL to use actual version number instead of "any"
                setTimeout(() => {
                    setURLParam("version", initialVersion);
                }, 0);
            } else {
                initialVersion = initialParams.version;
            }

            // Make sure the version exists in our options
            if (versionOptions.length > 0 && !versionOptions.some(v => v.value === initialVersion)) {
                initialVersion = String(latestLTS);
                // Update URL if the version was invalid
                if (initialParams.version !== initialVersion) {
                    setTimeout(() => {
                        setURLParam("version", initialVersion);
                    }, 0);
                }
            }

            setVersion(initialVersion);
        } else {
            setVersion(initialVersion);
        }

        // Initialize OS
        if (initialParams.os && osOptions.some(o => o.value === initialParams.os)) {
            initialOS = initialParams.os;
            setOS(initialOS);
        }

        // Initialize architecture
        if (initialParams.arch && architectureOptions.some(a => a.value === initialParams.arch)) {
            initialArch = initialParams.arch;
            setArch(initialArch);
        }

        // Trigger one initial fetch after the state is set
        // This is the only place we call onFiltersChange from an effect
        // We need to wrap this in a timeout to avoid state updates during render
        setTimeout(() => {
            onFiltersChange(initialVersion, initialOS, initialArch);
        }, 0);

        // This effect should only run once when we have all the data loaded
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [versionOptions.length > 0, latestLTS, osOptions.length, architectureOptions.length])

    // Handle changes for each filter
    const handleVersionChange = (newVersion: string) => {
        // First update the URL parameter with mode=filter to indicate this change
        // came from the AllVersions filter tab
        setURLParam("version", newVersion)
        setURLParam("mode", "filter") // Add this flag to the URL to track we're in filter mode

        setVersion(newVersion)

        // When switching versions, reset other filters
        if (newVersion !== version) {
            setURLParam("os", "any")
            setURLParam("arch", "any")

            // Update local state 
            const newOS = "any"
            const newArch = "any"
            setOS(newOS)
            setArch(newArch)

            // Call parent's change handler with the new values
            onFiltersChange(newVersion, newOS, newArch)
        } else {
            // Call parent's change handler with the new values
            onFiltersChange(newVersion, os, arch)
        }
    }

    const handleOSChange = (newOS: string) => {
        setURLParam("os", newOS)
        setURLParam("mode", "filter") // Add this flag to URL to stay in filter mode
        setOS(newOS)
        onFiltersChange(version, newOS, arch)
    }

    const handleArchChange = (newArch: string) => {
        setURLParam("arch", newArch)
        setURLParam("mode", "filter") // Add this flag to URL to stay in filter mode
        setArch(newArch)
        onFiltersChange(version, os, newArch)
    }

    // Handle reset all filters
    const handleReset = () => {
        const defaultVersion = String(latestLTS)
        const defaultOS = "any"
        const defaultArch = "any"

        // Update URL params
        setURLParam("version", defaultVersion)
        setURLParam("os", defaultOS)
        setURLParam("arch", defaultArch)
        setURLParam("mode", "filter") // Keep the filter mode active

        // Update local state
        setVersion(defaultVersion)
        setOS(defaultOS)
        setArch(defaultArch)

        // Notify parent component with a timeout to avoid React updates during render
        setTimeout(() => {
            onFiltersChange(defaultVersion, defaultOS, defaultArch)
        }, 0)
    }

    return (
        <section className="py-10">
            <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-white">Filter Releases</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Version selector */}
                    <div className="filter-group">
                        <label className="block text-sm font-medium text-gray-200 mb-2">Version</label>
                        {versionOptions.length > 0 ? (
                            <CommonSelector
                                list={versionOptions}
                                defaultValue={versionOptions.find(v => v.value === version)}
                                selectorUpdater={handleVersionChange}
                            />
                        ) : (
                            <div className="relative w-full flex items-center justify-between rounded-[80px] border-[2px] bg-transparent py-3 pl-8 pr-4 border-[#3E3355]">
                                <span className="flex items-center justify-between text-nowrap">
                                    Loading versions...
                                </span>
                            </div>
                        )}
                    </div>

                    {/* OS selector */}
                    <div className="filter-group">
                        <label className="block text-sm font-medium text-gray-200 mb-2">Operating System</label>
                        <CommonSelector
                            list={[{ name: "Any OS", value: "any" }, ...osOptions]}
                            defaultValue={os === "any" ? { name: "Any OS", value: "any" } : osOptions.find(o => o.value === os)}
                            selectorUpdater={handleOSChange}
                        />
                    </div>

                    {/* Architecture selector */}
                    <div className="filter-group">
                        <label className="block text-sm font-medium text-gray-200 mb-2">Architecture</label>
                        <CommonSelector
                            list={[{ name: "Any Architecture", value: "any" }, ...architectureOptions]}
                            defaultValue={arch === "any" ? { name: "Any Architecture", value: "any" } : architectureOptions.find(a => a.value === arch)}
                            selectorUpdater={handleArchChange}
                        />
                    </div>
                </div>

                {/* Reset button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3E3355] hover:bg-[#554772] text-white rounded-md transition-colors"
                    >
                        <FaUndo className="w-4 h-4" />
                        <span>Reset to Defaults</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ReleaseFilters
