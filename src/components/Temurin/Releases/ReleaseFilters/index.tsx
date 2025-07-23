"use client"

import React, { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { setURLParam } from "@/utils/setURLParam"
import { useOses, useArches } from '@/hooks/fetchConstants'
import CommonSelector from "@/components/Common/CommonSelector"
import { FaUndo } from "react-icons/fa"

interface ReleaseFiltersProps {
    onFiltersChange: (version: string, os: string, arch: string) => void
    initialParams: Record<string, string>
    allVersions: Array<{ name: string; value: string }>
    latestLTS: number
}

const ReleaseFilters: React.FC<ReleaseFiltersProps> = ({ onFiltersChange, initialParams, allVersions, latestLTS }) => {
    const t = useTranslations("Temurin.Releases.ReleaseFilters")
    // State for dropdown values
    const [version, setVersion] = useState<string>("any")
    const [os, setOS] = useState("any")
    const [arch, setArch] = useState("any")

    // Get OS and architecture options from hooks
    const osOptions = useOses(true)
    const architectureOptions = useArches(true)

    // Initialize filters from URL parameters - this runs only once after version options are loaded
    useEffect(() => {
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
            if (allVersions.length > 0 && !allVersions.some(v => v.value === initialVersion)) {
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
    }, [allVersions.length > 0, latestLTS, osOptions.length, architectureOptions.length])

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
        <section className="py-10" data-testid="release-filters-section">
            <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-white" data-testid="filter-title">{t('filter-releases')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="filters-grid">
                    {/* Version selector */}
                    <div className="filter-group" data-testid="version-filter-group">
                        <label className="block text-sm font-medium text-gray-200 mb-2">{t('version')}</label>
                        {allVersions.length > 0 ? (
                            <CommonSelector
                                list={allVersions}
                                defaultValue={allVersions.find(v => v.value === version)}
                                selectorUpdater={handleVersionChange}
                                data-testid="version-selector"
                            />
                        ) : (
                            <div className="relative w-full flex items-center justify-between rounded-[80px] border-[2px] bg-transparent py-3 pl-8 pr-4 border-[#3E3355]" data-testid="loading-versions">
                                <span className="flex items-center justify-between text-nowrap">
                                    {t('loading-versions')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* OS selector */}
                    <div className="filter-group" data-testid="os-filter-group">
                        <label className="block text-sm font-medium text-gray-200 mb-2">{t('operating-system')}</label>
                        <CommonSelector
                            list={[{ name: t('any-os'), value: "any" }, ...osOptions]}
                            defaultValue={os === "any" ? { name: t('any-os'), value: "any" } : osOptions.find(o => o.value === os)}
                            selectorUpdater={handleOSChange}
                            data-testid="os-selector"
                        />
                    </div>

                    {/* Architecture selector */}
                    <div className="filter-group" data-testid="arch-filter-group">
                        <label className="block text-sm font-medium text-gray-200 mb-2">{t('architecture')}</label>
                        <CommonSelector
                            list={[{ name: t('any-architecture'), value: "any" }, ...architectureOptions]}
                            defaultValue={arch === "any" ? { name: t('any-architecture'), value: "any" } : architectureOptions.find(a => a.value === arch)}
                            selectorUpdater={handleArchChange}
                            data-testid="arch-selector"
                        />
                    </div>
                </div>

                {/* Reset button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3E3355] hover:bg-[#554772] text-white rounded-md transition-colors"
                        data-testid="reset-filters-button"
                    >
                        <FaUndo className="w-4 h-4" />
                        <span>{t('reset-to-defaults')}</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ReleaseFilters
