"use client";

import type { VersionData } from "@/types/temurin";

export * from "./useOnScreen";
export * from "./fetchLatestTemurin";
export * from "./fetchTemurinReleases";
export * from "./fetchMarketplace";
export * from "./fetchReleaseNotes";
export * from "./fetchTemurinNightly";
export * from "./fetchLatestEvents";
export * from "./useAdoptiumContributorsApi";
export type {
  BinaryAssetView,
  TemurinAssets,
  Release,
  VersionData,
} from "@/types/temurin";

/**
 * This method compares two versions and returns:
 * ->  0 if versions are equals
 * -> -1 if versionA is lower than versionB
 * ->  1 if versionA is highter than versionB
 *
 * @param versionA
 * @param versionB
 * @returns
 */
export function compareVersions(
  versionA: VersionData,
  versionB: VersionData,
): number {
  let comparison = (versionA.major ?? 0) - (versionB.major ?? 0);
  if (comparison === 0) {
    comparison = (versionA.minor ?? 0) - (versionB.minor ?? 0);
    if (comparison === 0) {
      comparison = (versionA.security ?? 0) - (versionB.security ?? 0);
      if (comparison === 0) {
        comparison = (versionA.build ?? 0) - (versionB.build ?? 0);
        if (comparison === 0) {
          comparison =
            (versionA.adopt_build_number ? versionA.adopt_build_number : 0) -
            (versionB.adopt_build_number ? versionB.adopt_build_number : 0);
        }
      }
    }
  }
  return comparison;
}

export function getVersionAsString(
  version: VersionData,
  allowShortNotation: boolean = false,
): string {
  let result = `${version.major}.${version.minor}.${version.security}`;
  if (
    allowShortNotation &&
    !version.minor &&
    !version.security &&
    !version.patch
  ) {
    // when minor, security & patch are 0 => do not print .0.0.0
    result = `${version.major}`;
  }
  if (version.patch) {
    result += `.${version.patch}`;
  }
  if (version.pre) {
    result += `-${version.pre}`;
  }
  if (version.build) {
    result += `+${version.build}`;
    if (version.adopt_build_number) result += `.${version.adopt_build_number}`;
  }
  if (version.optional) {
    result += `-${version.optional}`;
  }
  return result;
}
