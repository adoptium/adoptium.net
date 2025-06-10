"use client";

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";

import VersionSelector from "@/components/VersionSelector"
import ButtonContent from "@/components/Temurin/ButtonContent"
import ReleaseSelector from "@/components/Temurin/ReleaseSelector"

import { useOses, useArches } from '@/hooks/fetchConstants'
import { setURLParam } from "@/utils/setURLParam"
import { packageTypes } from "@/utils/defaults"
import { ReleaseAsset } from '@/types/temurin'
import { TemurinReleaseAssets } from '@/hooks/fetchTemurinReleases'

// Define props for components
interface CommonProps {
  results: ReleaseAsset[];
  openModalWithChecksum: (checksum: string) => void;
  onReset: () => void;
}

interface TabsProps {
  updaterAction: (version: number, os: string, architecture: string, packageType: string) => Promise<TemurinReleaseAssets>;
  Table: React.ComponentType<CommonProps>;
  openModalWithChecksum: (checksum: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ updaterAction, Table, openModalWithChecksum }) => {
  const [latestLTS, setLatestLTS] = useState<number | string>(21); // Default to 21 if API fails
  const [ltsVersions, setLTSVersions] = useState<Array<{ name: string; value: number }>>([]);
  const [versions, setVersions] = useState<Array<{ name: string; value: string }>>([]);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('/api/available-releases');
        const data = await response.json();
        if (data.most_recent_lts) {
          setLatestLTS(data.most_recent_lts);
        }
        if (data.available_lts_releases && Array.isArray(data.available_lts_releases)) {
          setLTSVersions(data.available_lts_releases);
        }
        if (data.available_releases && Array.isArray(data.available_releases)) {
          setVersions(data.available_releases);
        }
      } catch (error) {
        console.error("Failed to fetch latest LTS version:", error);
      }
    };

    fetchReleases();
  }, []);

  // load OS and Arches from API
  const oses = useOses(true)
  const arches = useArches(true)
  const [ready, setReady] = useState(false)

  const searchParams = useSearchParams();
  const queryStringParams = Object.fromEntries(searchParams.entries());

  const [os, updateOS] = useState("any")
  const [arch, updateArch] = useState("any")
  const [version, udateVersion] = useState<string | number>("any")

  // Always default to the latest LTS tab
  const [activeVersionSelectorTab, setActiveVersionSelectorTab] = useState<number | string>(latestLTS)

  // Track whether user has explicitly selected the "All Versions" tab
  const [isAllVersionsMode, setIsAllVersionsMode] = useState(false)

  const [releases, setReleases] = useState<TemurinReleaseAssets>([])

  /**
   * This useEffect() is called when OS and arches are finaly loaded
   */
  useEffect(() => {
    // do nothing while OS and arches are not loaded
    if (oses.length === 0 || arches.length === 0) return;

    (async () => {
      // init the default selected Operation System, if any from the param 'os'
      let defaultSelectedOS = "any"
      const osParam = queryStringParams.os
      if (osParam) {
        const osParamStr = osParam.toString().toLowerCase()
        if (oses.findIndex(os => os.value === osParamStr) >= 0) {
          defaultSelectedOS = osParamStr
        }
      }

      // init the default selected Architecture, if any from the param 'arch'
      let defaultSelectedArch = "any"
      const archParam = queryStringParams.arch
      if (archParam) {
        const archParamStr = archParam.toString().toLowerCase()
        if (arches.findIndex(a => a.value === archParamStr) >= 0) {
          defaultSelectedArch = archParamStr
        }
      }

      // init the default selected Version, if any from the param 'version' or from 'variant'
      let defaultSelectedVersion = latestLTS
      let defaultActiveVersionSelectorTab = latestLTS
      const versionParam = queryStringParams.version
      if (versionParam) {
        const versionParamStr = versionParam.toString()
        const versionParamNum = Number(versionParamStr)

        if (versionParamStr.toLowerCase() === "latest") {
          // get the latest version of the list
          defaultSelectedVersion = ltsVersions.sort((a, b) => b.value - a.value)[0]?.value || latestLTS;
          defaultActiveVersionSelectorTab = defaultSelectedVersion;
        } else if (ltsVersions.findIndex(version => version.value === versionParamNum) >= 0) {
          // it is a valid LTS version
          defaultSelectedVersion = versionParamNum;
          defaultActiveVersionSelectorTab = versionParamNum;
        } else {
          // it is another valid version but not an LTS version
          defaultSelectedVersion = versionParamNum;
          // For non-LTS versions, we should use the All Versions tab (1)
          defaultActiveVersionSelectorTab = 1;
          // Flag that we're in All Versions mode
          setIsAllVersionsMode(true);
        }
      }

      // init the default selected Version, if any from the param 'variant'
      const variantParam = queryStringParams.variant
      if (variantParam) {
        // convert openjdk11 to 11
        const parsedVersion = variantParam.toString().replace(/\D/g, "")
        const variantParamNum = Number(parsedVersion)

        if (ltsVersions.findIndex(version => version.value === variantParamNum) >= 0) {
          defaultSelectedVersion = variantParamNum
        }
      }

      // Determine if we should show the All Versions tab
      const isLTSVersion = ltsVersions.some(v => v.value === defaultSelectedVersion);
      const hasSpecificOSFilter = defaultSelectedOS !== "any";
      const hasSpecificArchFilter = defaultSelectedArch !== "any";

      // Use All Versions tab in these cases:
      // 1. Non-LTS version selected
      // 2. Specific OS selected (not "any")
      // 3. Specific architecture selected (not "any")
      if ((!isLTSVersion && typeof defaultSelectedVersion === 'number') ||
        hasSpecificOSFilter ||
        hasSpecificArchFilter) {
        setIsAllVersionsMode(true);
        setActiveVersionSelectorTab(1);
      } else {
        // Otherwise use the specific version tab (for LTS versions with default filters)
        setIsAllVersionsMode(false);
        setActiveVersionSelectorTab(defaultActiveVersionSelectorTab);
      }

      // Now update the selection values
      updateOS(defaultSelectedOS);
      updateArch(defaultSelectedArch);
      udateVersion(defaultSelectedVersion);
      setURLParam("os", defaultSelectedOS);
      setURLParam("arch", defaultSelectedArch);
      setURLParam("version", defaultSelectedVersion);

      // OK we can loaded elements
      setReady(true)
    })();
  }, [
    ready,
    oses,
    arches,
    latestLTS,
    ltsVersions,
    queryStringParams.os,
    queryStringParams.arch,
    queryStringParams.package,
    queryStringParams.variant,
    queryStringParams.version
  ]);

  const versionUpdater = (version: string | number) => {
    // Save current All Versions mode BEFORE making state changes
    const wasInAllVersionsMode = isAllVersionsMode;

    // Update URL and version state
    setURLParam("version", version);
    udateVersion(version);

    // If we were in All Versions mode, make sure we stay there
    if (wasInAllVersionsMode) {
      // Force maintaining All Versions tab even after state changes
      setTimeout(() => {
        setIsAllVersionsMode(true);
        setActiveVersionSelectorTab(1);
      }, 0);
    }
  }

  const archUpdater = (arch: string) => {
    // Save current All Versions mode BEFORE making state changes
    const wasInAllVersionsMode = isAllVersionsMode;

    // Update the URL parameter and arch state
    setURLParam("arch", arch);
    updateArch(arch);

    // If we were in All Versions mode, make sure we stay there
    if (wasInAllVersionsMode) {
      // Force maintaining All Versions tab even after state changes
      setTimeout(() => {
        setIsAllVersionsMode(true);
        setActiveVersionSelectorTab(1);
      }, 0);
    }
  }

  const osUpdater = (os: string) => {
    // Save current All Versions mode BEFORE making state changes
    const wasInAllVersionsMode = isAllVersionsMode;

    // Update the URL parameter and OS state
    setURLParam("os", os);
    updateOS(os);

    // If we were in All Versions mode, make sure we stay there
    if (wasInAllVersionsMode) {
      // Force maintaining All Versions tab even after state changes
      setTimeout(() => {
        setIsAllVersionsMode(true);
        setActiveVersionSelectorTab(1);
      }, 0);
    }
  }

  // Reset function to clear all filters and return to defaults
  const handleReset = () => {
    // First update the values
    setURLParam("os", "any");
    setURLParam("arch", "any");
    setURLParam("version", latestLTS);

    updateOS("any");
    updateArch("any");
    udateVersion(latestLTS);

    // Return to specific version mode (JDK 21)
    setIsAllVersionsMode(false);
    setActiveVersionSelectorTab(latestLTS);
  }

  /**
   * This useEffect() is called when a parameter is changed
   */
  useEffect(() => {
    // do nothing while params are not ready
    if (!ready) return

    (async () => {
      // Convert version to number if it's a string and not "any"
      const versionParam = typeof version === "string" && version !== "any"
        ? parseInt(version, 10)
        : typeof version === "number"
          ? version
          : -1; // Use -1 as a fallback or special value to indicate "any"

      // Use the packageType parameter from URL if available
      const packageParam = queryStringParams.package ?
        queryStringParams.package.toString().toLowerCase() :
        "any";

      const packageType = packageTypes.findIndex(p => p.value === packageParam) >= 0 ?
        packageParam : "any";

      // Check conditions that should trigger the All Versions tab
      const isLTSVersion = versionParam !== -1 && ltsVersions.some(v => v.value === versionParam);
      const hasSpecificOSFilter = os !== "any";
      const hasSpecificArchFilter = arch !== "any";

      // Conditions that should trigger the All Versions tab:
      // 1. Non-LTS version selected
      // 2. Specific OS filter applied (not "any")
      // 3. Specific architecture filter applied (not "any")
      // 4. Already in All Versions mode (from user selection)
      if ((!isLTSVersion && versionParam !== -1) ||
        hasSpecificOSFilter ||
        hasSpecificArchFilter ||
        isAllVersionsMode) {
        // Enforce All Versions mode
        setIsAllVersionsMode(true);
        setActiveVersionSelectorTab(1);
      }
      // For LTS versions with default filters (any/any), match tab to version
      else if (versionParam !== -1) {
        const matchingLTS = ltsVersions.find(v => v.value === versionParam);
        if (matchingLTS) {
          setActiveVersionSelectorTab(matchingLTS.value);
        }
      }

      // Cast the result to TemurinReleaseAssets to match ButtonContent's expectations
      setReleases(await updaterAction(versionParam, os, arch, packageType) as TemurinReleaseAssets)
    })()
  }, [version, os, arch, updaterAction, ready, queryStringParams.package, isAllVersionsMode, ltsVersions])

  return (
    <>
      <section className="py-8 md:pt-16 px-6 w-full">
        <div className="w-full flex flex-col items-start justify-start sm:items-center sm:justify-center">
          <VersionSelector
            activeVersionTab={activeVersionSelectorTab}
            setActiveVersionTab={(tab) => {
              // Update tab selection state
              setActiveVersionSelectorTab(tab);

              // Update the All Versions mode flag
              const newIsAllVersionsMode = tab === 1;
              setIsAllVersionsMode(newIsAllVersionsMode);

              // If switching to All Versions, keep current version
              if (tab === 1) {
                // No need to update version, just show All Versions tab
              }
              // If switching to a specific LTS version tab
              else {
                // Update URL and version state
                setURLParam("version", tab);
                udateVersion(tab);

                // Also reset OS and arch to "any" when switching to LTS tab
                setURLParam("os", "any");
                updateOS("any");
                setURLParam("arch", "any");
                updateArch("any");
              }
            }}
            versions={ltsVersions}
            updateVersion={udateVersion}
            defaultVersion={latestLTS.toString()}
            updateOS={osUpdater}
            updateArch={archUpdater}
          />
          {isAllVersionsMode ? (
            <ReleaseSelector
              versions={versions}
              updateVersion={(selectedVersion) => {
                // IMPORTANT: First ensure we stay in All Versions mode
                // This must be done BEFORE calling versionUpdater
                setIsAllVersionsMode(true);
                setActiveVersionSelectorTab(1);

                // Then update the version
                versionUpdater(selectedVersion);
              }}
              defaultVersion={version.toString()}
              updateOS={osUpdater}
              defaultOS={os}
              updateArch={archUpdater}
              defaultArch={arch}
            />
          ) : (
            <ButtonContent results={releases} />
          )}
        </div>
      </section>
      <Table results={releases} openModalWithChecksum={openModalWithChecksum} onReset={handleReset} />
    </>
  )
}

export default Tabs
