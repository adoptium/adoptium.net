import type { components, operations } from "@/types/adoptiumApiTypes";
import { useEffect, useState } from "react";
import {
  fetchReleaseNotes as apiFetchReleaseNotes,
  fetchLatestReleaseName,
  fetchLatestAssets,
} from "@/services/adoptiumApi";

// Function to get the latest version string for a major version
async function getLatestVersionForMajor(
  majorVersion: string,
): Promise<string | null> {
  try {
    const data = (await fetchLatestAssets(majorVersion)) as Array<{
      release_name: string;
    }>;
    if (data && data.length > 0 && data[0].release_name) {
      return data[0].release_name;
    }
    return null;
  } catch (error) {
    console.error(
      `Failed to fetch latest version for major version ${majorVersion}:`,
      error,
    );
    return null;
  }
}

export function useFetchReleaseNotesForVersion(
  isVisible: boolean,
  version: string | undefined,
  sortReleaseNotesByCallback?: (result: ReleaseNoteAPIResponse) => void,
): ReleaseNoteDataBag | null {
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNoteDataBag | null>(
    null,
  );

  useEffect(() => {
    if (isVisible) {
      (async () => {
        let versionToDisplay = version;

        if (!versionToDisplay) {
          versionToDisplay = (await fetchLatestReleaseName()) ?? undefined;
        } else {
          // Check if the version is just a major version number (e.g., "8", "11", "17")
          const majorVersionRegex = /^\d+$/;
          if (majorVersionRegex.test(versionToDisplay)) {
            const latestVersion =
              await getLatestVersionForMajor(versionToDisplay);
            if (latestVersion) {
              versionToDisplay = latestVersion;
            }
          }
        }

        await apiFetchReleaseNotes(versionToDisplay!)
          .then(function (result: unknown) {
            const response = result as ReleaseNoteAPIResponse;
            if (sortReleaseNotesByCallback)
              sortReleaseNotesByCallback(response);
            const releaseNoteDataBag: ReleaseNoteDataBag = {
              releaseNoteAPIResponse: response,
              isValid: response.release_notes !== null,
            };
            setReleaseNotes(releaseNoteDataBag);
          })
          .catch(function () {
            const releaseNoteDataBag: ReleaseNoteDataBag = {
              isValid: false,
            };
            setReleaseNotes(releaseNoteDataBag);
          });
      })();
    }
  }, [isVisible, version, sortReleaseNotesByCallback]);

  return releaseNotes;
}

export interface ReleaseNoteDataBag {
  releaseNoteAPIResponse?: ReleaseNoteAPIResponse;
  isValid: boolean;
}

export type ReleaseNoteAPIResponse =
  operations["getReleaseNotes"]["responses"][200]["content"]["application/json"];

export type ReleaseNote = components["schemas"]["ReleaseNote"];
