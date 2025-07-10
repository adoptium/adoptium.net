"use client"

import React, { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import SelectorHeader from "@/components/Common/SelectorHeader"
import { useOses, useArches } from '@/hooks/fetchConstants'
import { packageTypes } from "@/utils/defaults"

interface ReleaseSelectorProps {
  marketplace?: boolean
  versions: {
    name: string
    value: string
  }[]
  defaultVersion?: string
  defaultOS?: string
  defaultArch?: string
  defaultPackageType?: string
  updateVersion: (version: string) => void
  updateOS: (os: string) => void
  updateArch: (arch: string) => void
  updatePackageType?: (pkgType: string) => void
}

const ReleaseSelector: React.FC<ReleaseSelectorProps> = ({
  marketplace,
  versions,
  defaultVersion,
  defaultOS,
  defaultArch,
  defaultPackageType,
  updateVersion,
  updateOS,
  updateArch,
  updatePackageType,
}) => {
  const t = useTranslations("Temurin.Releases.ReleaseFilters")
  // Track selected values for filtering
  const [selectedOS, setSelectedOS] = useState<string | undefined>(defaultOS);
  const [selectedArch, setSelectedArch] = useState<string | undefined>(defaultArch);

  // OS to architecture mapping for filtering
  const osToArchMap = useMemo(() => ({
    'windows': ['x64', 'x86', 'aarch64'],
    'mac': ['x64', 'aarch64'],
    'linux': ['x64', 'x86', 'arm', 'aarch64', 'ppc64le', 's390x', 'riscv64'],
    'alpine-linux': ['x64', 'aarch64'],
    'aix': ['ppc64'],
    'solaris': ['sparcv9', 'x64']
  }), []);

  // Architecture to OS mapping (derived from osToArchMap)
  const archToOsMap = useMemo(() => {
    const mapping: Record<string, string[]> = {};

    Object.entries(osToArchMap).forEach(([os, arches]) => {
      arches.forEach(arch => {
        if (!mapping[arch]) {
          mapping[arch] = [];
        }
        mapping[arch].push(os);
      });
    });

    return mapping;
  }, [osToArchMap]);

  // Custom wrappers for the update functions
  const handleOSChange = (os: string) => {
    setSelectedOS(os);
    updateOS(os);

    // If the current architecture isn't compatible with the new OS,
    // and the new OS isn't "any", reset architecture to "any"
    if (os !== 'any' && selectedArch && selectedArch !== 'any' &&
      !osToArchMap[os as keyof typeof osToArchMap]?.includes(selectedArch)) {
      setSelectedArch('any');
      updateArch('any');
    }
  };

  const handleArchChange = (arch: string) => {
    setSelectedArch(arch);
    updateArch(arch);

    // If the current OS isn't compatible with the new architecture,
    // and the new architecture isn't "any", reset OS to "any"
    if (arch !== 'any' && selectedOS && selectedOS !== 'any' &&
      !archToOsMap[arch]?.includes(selectedOS)) {
      setSelectedOS('any');
      updateOS('any');
    }
  };

  interface VersionNode {
    name: string;
    value: string;
  }

  const versionsList: VersionNode[] = versions.map((version: { name: string; value: string | number }): VersionNode => {
    return {
      name: version.name,
      value: String(version.value),
    }
  })

  // Get base lists
  const osList = useOses(true)
  const archList = useArches(true)

  // Filter OS list based on selected architecture
  const filteredOsList = useMemo(() => {
    if (osList.length === 0) return [];

    // If no architecture selected or "any" selected, show all OSes
    if (!selectedArch || selectedArch === 'any') {
      return osList;
    }

    // Otherwise, filter OSes to those compatible with the selected architecture
    return osList.filter(os => archToOsMap[selectedArch]?.includes(os.value));
  }, [osList, selectedArch, archToOsMap]);

  // Filter architecture list based on selected OS
  const filteredArchList = useMemo(() => {
    if (archList.length === 0) return [];

    // If no OS selected or "any" selected, show all architectures
    if (!selectedOS || selectedOS === 'any') {
      return archList;
    }

    // Otherwise, filter architectures to those compatible with the selected OS
    return archList.filter(arch => osToArchMap[selectedOS as keyof typeof osToArchMap]?.includes(arch.value));
  }, [archList, selectedOS, osToArchMap]);

  // Add "Any" option to the filtered lists
  const osListWithAny = useMemo(() => {
    if (filteredOsList.length === 0) return [];
    return [{ name: t("any-os"), value: "any" }, ...filteredOsList];
  }, [filteredOsList, t]);

  const archListWithAny = useMemo(() => {
    if (filteredArchList.length === 0) return [];
    return [{ name: t("any-architecture"), value: "any" }, ...filteredArchList];
  }, [filteredArchList, t]);

  // Create packageTypesWithAny unconditionally (following React Hooks rules)
  const packageTypesWithAny = useMemo(() => {
    return [{ name: t("any-package-type"), value: "any" }, ...packageTypes];
  }, [t]);

  // Conditionally use the data after hooks have been called
  const data = [osListWithAny, archListWithAny, versionsList];
  if (marketplace) {
    data.push(packageTypesWithAny);
  }

  const selectorUpdaters = [handleOSChange, handleArchChange, updateVersion]
  if (marketplace && updatePackageType) {
    selectorUpdaters.push(updatePackageType)
  }

  const titles = [t('operating-system'), t('architecture'), t('version'), t('package-type')]

  const defaultValues: string[] = []
  if (defaultOS) defaultValues.push(defaultOS)
  if (defaultArch) defaultValues.push(defaultArch)
  if (defaultVersion) defaultValues.push(defaultVersion)
  if (marketplace && defaultPackageType) {
    defaultValues.push(defaultPackageType)
  }

  return (
    <div>
      {" "}
      <div className="my-[50px]">
        <SelectorHeader
          data={data}
          selectorUpdater={selectorUpdaters}
          title={titles}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  )
}

export default ReleaseSelector
