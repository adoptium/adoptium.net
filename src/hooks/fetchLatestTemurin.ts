'use client'

import { Binary, VersionMetaData } from "@/types/temurin"
import { useEffect, useState } from "react"
import axios from "axios"

const baseUrl = "https://api.adoptium.net/v3"

export interface LatestTemurin {
  download_count: number
  id: string
  release_link: string
  release_name: string
  release_type: string
  source?: {
    link: string
    name: string
    size: number
  }
  timestamp: Date
  updated_at: Date
  vendor: string
  version_data: VersionMetaData
  binaries: [
    {
      architecture: string
      download_count: number
      heap_size: string
      image_type: string
      jvm_impl: string
      os: string
      package: {
        checksum: string
        checksum_link: string
        download_count: number
        link: string
        metadata_link: string
        name: string
        signature_link: string
        size: number
      }
      installer?: {
        checksum: string
        checksum_link: string
        download_count: number
        link: string
        metadata_link: string
        name: string
        signature_link: string
        size: number
      }
    }
  ]
}

export function useFetchLatestForOS(
  isVisible: boolean,
  version: number | string,
  os: string,
  arch: string,
): Binary | null {
  // Always declare hooks at the top level
  const [binary, setBinary] = useState<Binary | null>(null)

  useEffect(() => {
    // Early return inside useEffect instead of before hooks
    if (!os || !isVisible) {
      return;
    }

    const fetchBinary = async () => {
      const url = `${baseUrl}/assets/feature_releases/${version}/ga?os=${os}&architecture=${arch}&image_type=jdk&jvm_impl=hotspot&page_size=1&vendor=eclipse`

      try {
        const response = await axios.get(url);
        const json: LatestTemurin = response.data[0];

        let binary_link = json.binaries[0].package.link;
        let binary_checksum = json.binaries[0].package.checksum;

        if (json.binaries[0].installer) {
          binary_link = json.binaries[0].installer.link;
          binary_checksum = json.binaries[0].installer.checksum;
        }

        const packageData = json.binaries[0].package;
        const binary: Binary = {
          release_name: json.release_name,
          link: binary_link,
          checksum: binary_checksum,
          type: json.binaries[0].image_type,
          size: packageData.size,
          extension: packageData.name.split('.').pop() || ''
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
