import { ReleaseNoteAPIResponse } from "@/hooks"

export const createMockReleaseNotesAPI = (number: number): ReleaseNoteAPIResponse => ({
  id: "id_mock",
  vendor: "vendor_mock",
  version_data: {
    major: 0,
    minor: 0,
    security: 0,
    patch: 0,
    build: 0,
    openjdk_version: "openjdk_version_mock",
    semver: "semver_mock",
  },
  release_name: "release_name_mock",
  // return an array of length number with the same release notes
  release_notes: Array.from({ length: number }, (v, i) => ({
    id: i.toString(),
    link: new URL("https://link_mock"),
    title: "title_mock",
    priority: "1",
    type: "Bug",
    component: "component_mock",
  })),
})
