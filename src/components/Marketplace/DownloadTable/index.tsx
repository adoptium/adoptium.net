"use client"

import React, { useEffect, useState } from "react"
import ReleaseSelector from "@/components/Marketplace/ReleaseSelector"
import VendorSelector from "@/components/Marketplace/VendorSelector"
import AllReleaseCard from "@/components/Marketplace/AllReleasesCard"

import { setURLParam } from "@/utils/setURLParam"
import { detectOS, UserOS } from "@/utils/detectOS"
import { packageTypes, defaultArchitecture, defaultPackageType } from '@/utils/defaults'
import getVendorIdentifier from "@/utils/vendors"
import { getAllPkgsForVersion, MarketplaceRelease } from "@/hooks"
import { useArches, useOses } from '@/hooks/fetchConstants'
import vendors from "@/data/marketplace.json"
import { useSearchParams } from "next/navigation"
import { fetchAvailableReleases } from '@/utils/fetchAvailableReleases'

const DownloadTable = () => {
    const oses = useOses(true)
    const arches = useArches(true)
    const [ready, setReady] = useState(false)
    const searchParams = useSearchParams();

    const [os, updateOS] = useState("")
    const [arch, updateArch] = useState(defaultArchitecture)
    // Fix: always use string for version, and vendor identifiers
    const [version, updateVersion] = useState("21")
    const [packageType, updatePackageType] = useState(defaultPackageType)
    const [selectedVendorIdentifiers, updateSelectedVendorIdentifiers] = useState<string[]>([])
    const [releases, setReleases] = useState<MarketplaceRelease[] | null>(null)
    const [versions, setVersions] = useState<{ name: string; value: string }[]>([])

    // Parse query params from Next.js router
    useEffect(() => {
        if (oses.length === 0 || arches.length === 0) return;
        const params = Object.fromEntries(searchParams.entries());
        let defaultSelectedArch = defaultArchitecture;
        let defaultSelectedOS = "";
        let defaultSelectedPackageType = defaultPackageType;
        let defaultSelectedVersion = "21";

        // Arch param
        if (params.arch && arches.find(a => a.value === params.arch)) {
            defaultSelectedArch = params.arch;
        }
        // OS param
        if (params.os && oses.find(os => os.value === params.os)) {
            defaultSelectedOS = params.os;
        } else {
            const userOS = detectOS();
            switch (userOS) {
                case UserOS.MAC:
                    defaultSelectedOS = "mac";
                    if (typeof window !== "undefined" && typeof document !== "undefined") {
                        const gl = document.createElement("canvas").getContext("webgl");
                        const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
                        const param = (ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || "";
                        if (param.match(/Apple/) && !param.match(/Apple GPU/)) {
                            defaultSelectedArch = "aarch64";
                        }
                    }
                    break;
                case UserOS.LINUX:
                case UserOS.UNIX:
                    defaultSelectedOS = "linux";
                    break;
                default:
                    defaultSelectedOS = "windows";
                    break;
            }
        }
        // Package type param
        if (params.package_type && packageTypes.find(p => p.value === params.package_type)) {
            defaultSelectedPackageType = params.package_type;
        }
        // Version param
        if (params.version && typeof params.version === "string") {
            defaultSelectedVersion = params.version;
        }
        updateOS(defaultSelectedOS);
        updateArch(defaultSelectedArch);
        updateVersion(defaultSelectedVersion);
        updatePackageType(defaultSelectedPackageType);
        setReady(true);
    }, [oses, arches, searchParams]);

    // Fetch available versions for ReleaseSelector
    useEffect(() => {
        fetchAvailableReleases().then(setVersions)
    }, [])

    useEffect(() => {
        if (!ready) return;
        (async () => {
            setReleases(
                await getAllPkgsForVersion(
                    Number(version), // fix: ensure number
                    os,
                    arch,
                    packageType,
                    selectedVendorIdentifiers,
                ),
            )
        })()
    }, [ready, version, os, arch, packageType, selectedVendorIdentifiers])

    const versionUpdater = (version: string) => {
        setURLParam("version", version)
        updateVersion(version)
    }
    const archUpdater = (arch: string) => {
        setURLParam("arch", arch)
        updateArch(arch)
    }
    const osUpdater = (os: string) => {
        setURLParam("os", os)
        updateOS(os)
    }
    const handleReset = () => {
        const defaultOS = ""
        const defaultArch = defaultArchitecture
        const defaultVersion = "21"
        const defaultPackage = defaultPackageType
        // Fix: getVendorIdentifier expects a vendor object
        const defaultVendors: string[] = vendors.map(vendor => getVendorIdentifier(vendor))
        setURLParam("os", defaultOS)
        setURLParam("arch", defaultArch)
        setURLParam("version", defaultVersion)
        setURLParam("package_type", defaultPackage)
        updateOS(defaultOS)
        updateArch(defaultArch)
        updateVersion(defaultVersion)
        updatePackageType(defaultPackage)
        updateSelectedVendorIdentifiers(defaultVendors)
    }
    if (!ready) return null;
    return (
        <div className="max-w-[1264px] mx-auto px-6 pb-20">
            <ReleaseSelector
                marketplace
                versions={versions} // fix: pass versions prop
                updateVersion={versionUpdater}
                defaultVersion={version}
                updateOS={osUpdater}
                defaultOS={os}
                updateArch={archUpdater}
                defaultArch={arch}
                updatePackageType={updatePackageType}
            />
            <VendorSelector
                selectedVendorIdentifiers={selectedVendorIdentifiers}
                setSelectedVendorIdentifiers={updateSelectedVendorIdentifiers}
            />
            <AllReleaseCard results={releases} onReset={handleReset} />
        </div>
    )
}

export default DownloadTable