"use client";

import { Release } from "@/types/temurin";
import { useEffect, useState } from "react";
import { fetchFeatureReleases } from "@/services/adoptiumApi";

export type LatestTemurin = Release;

interface DownloadBinary {
  release_name: string;
  link: string;
  installer_link?: string;
  checksum: string;
  type: string;
  size: number;
  extension: string;
}

export function useFetchLatestForOS(
  isVisible: boolean,
  version: number,
  os: string,
  arch: string,
): DownloadBinary | null {
  // Always declare hooks at the top level
  const [binary, setBinary] = useState<DownloadBinary | null>(null);

  useEffect(() => {
    // Early return inside useEffect instead of before hooks
    if (!os || !isVisible) {
      return;
    }

    const fetchBinary = async () => {
      const params: Record<string, string> = {
        os,
        architecture: arch,
        image_type: "jdk",
        jvm_impl: "hotspot",
        page_size: "1",
      };

      try {
        const { data } = await fetchFeatureReleases(version, "ga", params);
        const json: LatestTemurin = (data as unknown as LatestTemurin[])[0];
        const bin = json.binaries?.[0];

        let binary_link = bin?.package?.link ?? "";
        let binary_checksum = bin?.package?.checksum ?? "";
        let installer_link: string | undefined;

        if (bin?.installer) {
          installer_link =
            (bin.installer as { link?: string }).link ?? binary_link;
          binary_link = installer_link;
          binary_checksum =
            (bin.installer as { checksum?: string }).checksum ??
            binary_checksum;
        }

        const packageData = bin?.package;
        const binary: DownloadBinary = {
          release_name: json.release_name ?? "",
          link: binary_link,
          installer_link,
          checksum: binary_checksum,
          type: bin?.image_type ?? "",
          size: packageData?.size ?? 0,
          extension: packageData?.name?.split(".").pop() ?? "",
        };
        setBinary(binary);
      } catch {
        // Just set binary to null on error
        setBinary(null);
      }
    };

    fetchBinary();
  }, [isVisible, version, os, arch]);

  return binary;
}
