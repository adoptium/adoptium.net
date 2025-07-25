"use client"

import React, { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { loadLatestAssets } from "@/hooks"
import { useSearchParams } from "next/navigation"
import { ReleaseAsset } from "@/types/temurin"
import { setURLParam } from "@/utils/setURLParam"
import PageHeader from "@/components/Common/PageHeader"
import ReleaseFilters from "@/components/Temurin/Releases/ReleaseFilters"
import ReleaseResults from "@/components/Temurin/Releases/ReleaseResults"
import ReleaseLinks from "@/components/Temurin/Releases/ReleaseLinks"
import OneClickDownload from "@/components/Temurin/Releases/OneClickDownload"
import DownloadMethods from "@/components/Temurin/DownloadMethods"
import VersionSelector from "@/components/VersionSelector"
import ChecksumModal from "@/components/ChecksumModal"

interface AvailableReleases {
  available_lts_releases: number[];
  available_releases: number[];
  most_recent_lts: number;
}

export default function TemurinReleasesPage({ availableReleases }: { availableReleases: AvailableReleases }) {
  const t = useTranslations("TemurinReleases")
  const [modalOpen, setModalOpen] = useState(false)
  const [currentChecksum, setCurrentChecksum] = useState("")
  const [releases, setReleases] = useState<ReleaseAsset[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter state
  const [selectedVersion, setSelectedVersion] = useState<string>("")
  const [selectedOS, setSelectedOS] = useState("any")
  const [selectedArch, setSelectedArch] = useState("any")

  // LTS version tab state
  const ltsVersions = availableReleases.available_lts_releases.map((version: number) => ({
    name: `${version} - LTS`,
    value: version,
  }))
  const allVersions = availableReleases.available_releases.map((version: number) => {
    const isLTS = availableReleases.available_lts_releases.includes(version);
    return {
      name: isLTS ? `${version} - LTS` : version.toString(),
      value: version.toString(),
    };
  });
  const latestLTS = availableReleases.most_recent_lts
  const [activeVersionTab, setActiveVersionTab] = useState<number | string>(21)
  const [isAllVersionsMode, setIsAllVersionsMode] = useState(false)

  const searchParams = useSearchParams()

  // Flag to track if we've already fetched data
  const [hasInitialFetch, setHasInitialFetch] = useState(false)

  // Flag to track if we're handling a filter change (vs initial page load)
  const [isFilterChange, setIsFilterChange] = useState(false)

  // Load initial data when component mounts if no URL parameters
  useEffect(() => {
    // If we haven't fetched yet, and we're not already loading, do an initial fetch
    if (!hasInitialFetch && !isLoading) {
      // Get version from URL params if it exists
      const params = Object.fromEntries(searchParams.entries());
      const initialVersion = params.version || String(latestLTS);
      const initialOS = params.os || "any";
      const initialArch = params.arch || "any";

      // Don't proceed with tab selection if LTS versions aren't loaded yet
      if (ltsVersions.length === 0) {
        // Just do the initial fetch with the given version
        fetchReleases(initialVersion, "any", "any")
        setSelectedVersion(initialVersion)
        return;
      }

      // Check if version is in LTS versions list
      const isLTSVersion = ltsVersions.some(lts => String(lts.value) === initialVersion);

      // Check if OS or architecture are not "any"
      const hasNonDefaultFilters = initialOS !== "any" || initialArch !== "any";

      // This is only run during initial page load, so we can safely set the tab mode
      // Set All Versions mode if:
      // 1. It's not an LTS version, OR
      // 2. OS or arch parameters are not "any"
      if (!isLTSVersion || hasNonDefaultFilters) {
        setIsAllVersionsMode(true);
        setActiveVersionTab(1); // 1 represents All Versions tab
      } else if (isLTSVersion && !hasNonDefaultFilters) {
        // If it is an LTS version with default OS/arch, select that specific tab
        setIsAllVersionsMode(false);
        // Use the numeric version value to select the correct tab
        setActiveVersionTab(parseInt(initialVersion, 10));
      }

      fetchReleases(initialVersion, initialOS, initialArch)

      // Update selected version to match
      setSelectedVersion(initialVersion)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Listen for URL parameter changes and update filters accordingly
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    // Only update if we have parameters
    if (Object.keys(params).length > 0) {
      const version = params.version || latestLTS.toString();
      const os = params.os || "any";
      const arch = params.arch || "any";
      const mode = params.mode;

      // Get previous values to detect changes
      const prevVersion = selectedVersion;

      // Update state
      setSelectedVersion(version);
      setSelectedOS(os);
      setSelectedArch(arch);

      // Check if version is in LTS versions list
      const isLTSVersion = ltsVersions.some(lts => String(lts.value) === version);

      // Check if OS or architecture are not "any"
      const hasNonDefaultFilters = os !== "any" || arch !== "any";

      // Determine if this is a page load or a filter change
      const isPageLoading = !hasInitialFetch && !isFilterChange;

      // Only change tab selection if:
      // 1. This is the initial page load (not a filter change), AND
      // 2. We have LTS versions loaded
      if (ltsVersions.length > 0) {
        // Always use All Versions tab if mode=filter is present in the URL
        if (mode === "filter") {
          setIsAllVersionsMode(true);
          setActiveVersionTab(1); // 1 represents All Versions tab
        }
        // If it's a filter change, don't change the tab mode (All Versions vs LTS tabs)
        else if (isPageLoading) {
          // Set All Versions mode if:
          // 1. It's not an LTS version, OR
          // 2. OS or arch parameters are not "any"
          if ((!isLTSVersion) || hasNonDefaultFilters) {
            setIsAllVersionsMode(true);
            setActiveVersionTab(1); // 1 represents All Versions tab
          } else if (isLTSVersion && !hasNonDefaultFilters) {
            // If it is an LTS version with default OS/arch, select that specific tab
            setIsAllVersionsMode(false);
            setActiveVersionTab(parseInt(version, 10));
          }
        }
        // The mode=filter parameter now handles this case
        // If it's a filter change and we're already in All Versions mode, stay there
        else if ((isFilterChange && isAllVersionsMode) ||
          // Check for version change within the All Versions tab
          (isAllVersionsMode && prevVersion !== version)) {
          // Explicitly set All Versions tab to ensure it stays active
          setActiveVersionTab(1);
          // This ensures when selecting an LTS version in All Versions tab, we stay in All Versions tab
        }
        // Always ensure non-LTS versions show in All Versions tab, even after initial load
        else if (!isAllVersionsMode && !isLTSVersion) {
          // Non-LTS version should always be in All Versions tab
          setIsAllVersionsMode(true);
          setActiveVersionTab(1);
        }
        // For LTS versions, ensure the correct LTS tab is selected when in LTS mode
        else if (!isAllVersionsMode && isLTSVersion) {
          setActiveVersionTab(parseInt(version, 10));
        }
      }
      // If not initial load, preserve the current tab mode for other cases

      // Fetch with new parameters
      fetchReleases(version, os, arch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hasInitialFetch, isFilterChange]);

  const fetchReleases = async (
    version: string | number,
    os: string,
    arch: string,
  ) => {
    if (isLoading) return;

    setIsLoading(true)
    try {
      const results = await loadLatestAssets(
        version,
        os,
        arch
      )
      setReleases(results)
      setHasInitialFetch(true)
    } catch (error) {
      console.error("Error fetching releases:", error)
      setReleases([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (
    version: string,
    os: string,
    arch: string
  ) => {
    // Mark this as a filter change to prevent tab switching
    setIsFilterChange(true)

    // Update state first
    setSelectedVersion(version)
    setSelectedOS(os)
    setSelectedArch(arch)

    // Then fetch data (always fetch both JDK and JRE)
    fetchReleases(version, os, arch)
  }

  const openModalWithChecksum = (checksum: string) => {
    setCurrentChecksum(checksum)
    setModalOpen(true)
  }

  return (
    <div>
      <PageHeader
        title={t('title')}
        subtitle={t('latest-releases')}
        description={t('description')}
      />

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 pb-20">
        {/* Version Selector Tabs */}
        <section className="pt-8">
          <VersionSelector
            activeVersionTab={activeVersionTab}
            setActiveVersionTab={(tab) => {
              // Update tab selection state
              setActiveVersionTab(tab);

              // Update the All Versions mode flag
              const newIsAllVersionsMode = tab === 1;
              setIsAllVersionsMode(newIsAllVersionsMode);

              // If switching to All Versions, keep current version but update URL
              if (tab === 1) {
                // Keep the current version but update the URL to show it
                setURLParam("version", selectedVersion);
                // Add mode=filter parameter to indicate we're in All Versions tab
                setURLParam("mode", "filter");

                // Set the filter change flag to prevent the URL parameter change
                // from causing a tab switch back to the LTS tab
                setIsFilterChange(true);

                // Don't change the version, but we may need to ensure it's loaded in All Versions tab
                // Force a data refresh to ensure the current version is loaded in the All Versions tab
                fetchReleases(selectedVersion, selectedOS, selectedArch);

                // Reset the filter change flag after a brief delay
                setTimeout(() => {
                  setIsFilterChange(false);
                }, 1000);
              }
              // If switching to a specific LTS version tab
              else {
                // Update URL and version state
                setURLParam("version", String(tab));
                setSelectedVersion(String(tab));

                // Remove the mode parameter when switching to a specific LTS tab
                setURLParam("mode", undefined);

                // Also reset OS and arch to "any"
                setURLParam("os", "any");
                setSelectedOS("any");
                setURLParam("arch", "any");
                setSelectedArch("any");

                // Fetch results for this tab
                fetchReleases(String(tab), "any", "any");
              }
            }}
            versions={ltsVersions}
            updateVersion={(version) => setSelectedVersion(String(version))}
            defaultVersion={selectedVersion}
            updateOS={setSelectedOS}
            updateArch={setSelectedArch}
          />
        </section>

        {/* Filters section - only show in All Versions mode */}
        {isAllVersionsMode && (
          <ReleaseFilters
            onFiltersChange={handleFiltersChange}
            initialParams={Object.fromEntries(searchParams.entries())}
            allVersions={allVersions}
            latestLTS={latestLTS}
          />
        )}

        {/* Links section - release notes, installation guide, etc. */}
        <ReleaseLinks
          selectedVersion={selectedVersion}
          releases={releases}
        />

        {!isAllVersionsMode && (
          < OneClickDownload
            selectedVersion={selectedVersion}
            releases={releases}
          />
        )}

        {/* Results section */}
        <ReleaseResults
          releases={releases}
          isLoading={isLoading}
          openModalWithChecksum={openModalWithChecksum}
        />

      </div>
      <DownloadMethods />
      <ChecksumModal
        open={modalOpen}
        setOpen={setModalOpen}
        checksum={currentChecksum}
      />
    </div>
  )
}
