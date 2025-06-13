import { VersionMetaData } from "."
import { useEffect, useState } from "react"
import axios from "axios"

const baseUrl = "https://api.adoptium.net/v3/info/release_notes"
const releaseNamesUrl = 'https://api.adoptium.net/v3/info/release_names?heap_size=normal&image_type=jdk&lts=true&page=0&page_size=1&project=jdk&release_type=ga&semver=false&sort_method=DEFAULT&sort_order=DESC&vendor=eclipse';

export function useFetchReleaseNotesForVersion(
  isVisible: boolean,
  version: string | undefined,
  sortReleaseNotesByCallback?: (result: ReleaseNoteAPIResponse) => void,
): ReleaseNoteDataBag | null {
  const [releaseNotes, setReleaseNotes] =
    useState<ReleaseNoteDataBag | null>(null)

  useEffect(() => {
    if (isVisible) {
      (async () => {
        let versionToDisplay = version;

        if (!versionToDisplay) {
          // retrieve the last version as default Release notes
          await axios.get(releaseNamesUrl)
            .then(function (response) {
              versionToDisplay = response.data.releases[0];
            })
            .catch(function () {
              // ignore
            });
        }

        const url = `${baseUrl}/${versionToDisplay}`;

        console.log(`Fetching release notes for version: ${versionToDisplay} from URL: ${url}`)

        await axios
          .get(url.toString())
          .then(function (response) {
            const result = response.data
            if (sortReleaseNotesByCallback) sortReleaseNotesByCallback(result)
            const releaseNoteDataBag: ReleaseNoteDataBag = {
              releaseNoteAPIResponse: result,
              isValid: (result.release_notes !== null)
            };
            setReleaseNotes(releaseNoteDataBag);
          })
          .catch(function () {
            const releaseNoteDataBag: ReleaseNoteDataBag = {
              isValid: false
            };
            setReleaseNotes(releaseNoteDataBag);
          })
      })()
    }
  }, [isVisible, version, sortReleaseNotesByCallback])

  return releaseNotes
}

export interface ReleaseNoteDataBag {
  releaseNoteAPIResponse?: ReleaseNoteAPIResponse
  isValid: boolean
}

export interface ReleaseNoteAPIResponse {
  id: string
  release_name: string
  release_notes: ReleaseNote[]
  vendor: string
  version_data: VersionMetaData
}

export interface ReleaseNote {
  id: string
  link: URL
  title: string
  backportOf?: string
  priority?: string
  component?: string
  subcomponent?: string
  type?: string
}
