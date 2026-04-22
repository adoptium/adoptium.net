"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReleaseSelector from "@/components/Marketplace/ReleaseSelector";
import VendorSelector from "@/components/Marketplace/VendorSelector";
import AllReleaseCard from "@/components/Marketplace/AllReleasesCard";

import { setURLParam } from "@/utils/setURLParam";
import { detectOS, UserOS } from "@/utils/detectOS";
import {
  packageTypes,
  defaultArchitecture,
  defaultPackageType,
} from "@/utils/defaults";
import getVendorIdentifier from "@/utils/vendors";
import { getAllPkgsForVersion, MarketplaceRelease } from "@/hooks";
import type {
  OperatingSystem,
  Architecture,
  ImageType,
} from "@/hooks/fetchMarketplace";
import type { MarketplaceVendor } from "@/services/adoptiumApi";
import { useArches, useOses } from "@/hooks/fetchConstants";
import vendors from "@/data/marketplace.json";

interface DownloadTableProps {
  ltsVersions: { name: string; value: string }[];
  latestLTS?: number;
}

const DownloadTable: React.FC<DownloadTableProps> = ({
  ltsVersions,
  latestLTS,
}) => {
  const oses = useOses(true);
  const arches = useArches(true);
  const [ready, setReady] = useState(false);
  const searchParams = useSearchParams();

  const [os, updateOS] = useState<OperatingSystem>("any");
  const [arch, updateArch] = useState<Architecture>(
    defaultArchitecture as Architecture,
  );
  const [version, updateVersion] = useState("21");
  const [packageType, updatePackageType] = useState<ImageType>(
    defaultPackageType as ImageType,
  );
  const [selectedVendorIdentifiers, updateSelectedVendorIdentifiers] = useState<
    MarketplaceVendor[]
  >([]);
  const [releases, setReleases] = useState<MarketplaceRelease[] | null>(null);

  // Parse query params from Next.js router
  useEffect(() => {
    if (oses.length === 0 || arches.length === 0) return;
    const params = Object.fromEntries(searchParams.entries());
    let defaultSelectedArch = defaultArchitecture;
    let defaultSelectedOS = "";
    let defaultSelectedPackageType = defaultPackageType;
    let defaultSelectedVersion = String(latestLTS);

    // Arch param
    if (params.arch && arches.find((a) => a.value === params.arch)) {
      defaultSelectedArch = params.arch;
    }
    // OS param
    if (params.os && oses.find((os) => os.value === params.os)) {
      defaultSelectedOS = params.os;
    } else {
      const userOS = detectOS();
      switch (userOS) {
        case UserOS.MAC:
          defaultSelectedOS = "mac";
          if (
            typeof window !== "undefined" &&
            typeof document !== "undefined"
          ) {
            const gl = document.createElement("canvas").getContext("webgl");
            const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
            const param =
              (ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || "";
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
    if (
      params.package_type &&
      packageTypes.find((p) => p.value === params.package_type)
    ) {
      defaultSelectedPackageType = params.package_type;
    }
    // Version param
    if (params.version && typeof params.version === "string") {
      defaultSelectedVersion = params.version;
    }
    updateOS(defaultSelectedOS as OperatingSystem);
    updateArch(defaultSelectedArch as Architecture);
    updateVersion(defaultSelectedVersion);
    updatePackageType(defaultSelectedPackageType as ImageType);
    setReady(true);
  }, [oses, arches, searchParams, latestLTS]);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      setReleases(
        await getAllPkgsForVersion(
          Number(version),
          os,
          arch,
          packageType,
          selectedVendorIdentifiers,
        ),
      );
    })();
  }, [ready, version, os, arch, packageType, selectedVendorIdentifiers]);

  const versionUpdater = (version: string) => {
    setURLParam("version", version);
    updateVersion(version);
  };
  const archUpdater = (arch: string) => {
    setURLParam("arch", arch);
    updateArch(arch as Architecture);
  };
  const osUpdater = (os: string) => {
    setURLParam("os", os);
    updateOS(os as OperatingSystem);
  };
  const handleReset = () => {
    const defaultOS: OperatingSystem = "any";
    const defaultArch: Architecture = defaultArchitecture as Architecture;
    const defaultVersion = "21";
    const defaultPackage: ImageType = defaultPackageType as ImageType;
    // Fix: getVendorIdentifier expects a vendor object
    const defaultVendors: MarketplaceVendor[] = vendors.map(
      (vendor) => getVendorIdentifier(vendor) as MarketplaceVendor,
    );
    setURLParam("os", defaultOS);
    setURLParam("arch", defaultArch);
    setURLParam("version", defaultVersion);
    setURLParam("package_type", defaultPackage);
    updateOS(defaultOS);
    updateArch(defaultArch);
    updateVersion(defaultVersion);
    updatePackageType(defaultPackage);
    updateSelectedVendorIdentifiers(defaultVendors);
  };
  if (!ready) return null;
  return (
    <div className="max-w-[1264px] mx-auto px-6 pb-20">
      <ReleaseSelector
        marketplace
        versions={ltsVersions}
        updateVersion={versionUpdater}
        defaultVersion={version}
        updateOS={osUpdater}
        defaultOS={os}
        updateArch={archUpdater}
        defaultArch={arch}
        updatePackageType={(pkg) => updatePackageType(pkg as ImageType)}
      />
      <VendorSelector
        selectedVendorIdentifiers={selectedVendorIdentifiers}
        setSelectedVendorIdentifiers={(ids) =>
          updateSelectedVendorIdentifiers(ids as MarketplaceVendor[])
        }
      />
      <AllReleaseCard results={releases} onReset={handleReset} />
    </div>
  );
};

export default DownloadTable;
