import {
  LatestTemurin,
  MockTemurinFeatureReleaseAPI,
  MockTemurinReleaseAPI,
  ReleaseNoteAPIResponse,
  ReleaseAsset,
  TemurinReleases,
} from "@/hooks";

export const createRandomTemurinRelease = (
  installer: boolean
): ReleaseAsset => ({
  os: "os_mock",
  architecture: "arch_mock",
  release_link: "https://release_link_mock",
  platform_name: "platform_name_mock",
  release_name: "release_name_mock",
  release_date: "2020-01-01T00:00:00Z",
  version: {
    major: 21,
    minor: 0,
    security: 1,
    patch: 0,
    build: 0,
    openjdk_version: "openjdk_version_mock",
    semver: "21.0.1+0",
  },
  binaries: [
    {
      type: "type_mock",
      link: "https://link_mock",
      checksum: "checksum_mock",
      size: 0,
      extension: "extension_mock",
      release_name: "release_name_mock",
      installer_link: installer ? "https://installer_link_mock" : undefined,
      installer_checksum: installer ? "installer_checksum_mock" : undefined,
      installer_size: installer ? 0 : undefined,
      installer_extension: installer ? "installer_extension_mock" : undefined,
    },
  ],
});

export const mockLatestTemurin = (installer: boolean): LatestTemurin => ({
  download_count: 0,
  id: "id_mock",
  release_link: "https://release_link_mock",
  release_name: "release_name_mock",
  release_type: "release_type_mock",
  timestamp: new Date(Date.UTC(2020, 0, 1)),
  updated_at: new Date(Date.UTC(2020, 0, 1)),
  vendor: "vendor_mock",
  version_data: {
    major: 21,
    minor: 0,
    security: 1,
    patch: 0,
    build: 0,
    openjdk_version: "openjdk_version_mock",
    semver: "21.0.1+0",
  },
  binaries: [
    {
      os: "os_mock",
      architecture: "arch_mock",
      image_type: "type_mock",
      heap_size: "heap_size_mock",
      download_count: 0,
      jvm_impl: "jvm_impl_mock",
      package: {
        name: "name_mock.tar.gz",
        link: "https://link_mock",
        checksum: "sha256sum_mock",
        checksum_link: "https://sha256sum_link_mock",
        metadata_link: "https://metadata_link_mock",
        signature_link: "https://signature_link_mock",
        size: 0,
        download_count: 0,
      },
      installer: installer
        ? {
            name: "installer_name_mock.msi",
            link: "https://installer_link_mock",
            checksum: "installer_sha256sum_mock",
            checksum_link: "https://installer_sha256sum_link_mock",
            metadata_link: "https://installer_metadata_link_mock",
            signature_link: "https://installer_signature_link_mock",
            size: 0,
            download_count: 0,
          }
        : undefined,
    },
  ],
});

export const createMockTemurinReleaseAPI = (
  installer: boolean,
  image_type: string
): MockTemurinReleaseAPI => ({
  release_link: "https://release_link_mock",
  release_name: "release_name_mock",
  vendor: "vendor_mock",
  version: {
    major: 21,
    minor: 0,
    security: 12,
    patch: 0,
    build: 0,
    openjdk_version: "openjdk_version_mock",
    semver: "21.0.12+0",
  },
  binary: {
    architecture: "arch_mock",
    project: "project_mock",
    scm_ref: "scm_ref_mock",
    download_count: 0,
    updated_at: new Date(Date.UTC(2020, 0, 1)),
    os: "os_mock",
    image_type: image_type ? image_type : "jdk",
    jvm_impl: "jvm_impl_mock",
    heap_size: "heap_size_mock",
    package: {
      name: "name_mock.tar.gz",
      link: "https://link_mock",
      checksum: "checksum_mock",
      checksum_link: "https://checksum_link_mock",
      metadata_link: "https://metadata_link_mock",
      signature_link: "https://signature_link_mock",
      size: 0,
      download_count: 0,
    },
    installer: installer
      ? {
          name: "installer_name_mock.msi",
          link: "https://installer_link_mock",
          checksum: "installer_checksum_mock",
          checksum_link: "https://installer_checksum_link_mock",
          metadata_link: "https://installer_metadata_link_mock",
          signature_link: "https://installer_signature_link_mock",
          size: 0,
          download_count: 0,
        }
      : undefined,
  },
});

export const createMockReleaseNotesAPI = (
  number: number
): ReleaseNoteAPIResponse => ({
  id: "id_mock",
  vendor: "vendor_mock",
  version_data: {
    major: 0,
    minor: 0,
    security: 0,
    patch: 0,
    build: 0,
    openjdk_version: "openjdk_version_mock",
    semver: "0.0.0+0",
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
});

export const createMockTemurinFeatureReleaseAPI = (
  installer: boolean
): MockTemurinFeatureReleaseAPI => ({
  id: "id_mock",
  download_count: 0,
  release_name: "release_name_mock",
  release_link: new URL("https://release_link_mock"),
  release_type: "release_type_mock",
  timestamp: new Date(Date.UTC(2020, 0, 1)),
  updated_at: new Date(Date.UTC(2020, 0, 1)),
  vendor: "vendor_mock",
  version_data: {
    major: 0,
    minor: 0,
    security: 0,
    patch: 0,
    build: 0,
    openjdk_version: "openjdk_version_mock",
    semver: "0.0.0+0",
  },
  binaries: [
    {
      os: "os_mock",
      architecture: "arch_mock",
      image_type: "jdk",
      package: {
        name: "name_mock.tar.gz",
        checksum: "checksum_mock",
        link: new URL("https://link_mock"),
        size: 0,
      },
      installer: installer
        ? {
            name: "installer_name_mock.msi",
            checksum: "installer_checksum_mock",
            link: new URL("https://installer_link_mock"),
            size: 0,
          }
        : undefined,
    },
  ],
});

export const createRandomTemurinReleases = (
  installer: boolean
): TemurinReleases => ({
  release_name: "release_name_mock",
  release_link: new URL("https://release_link_mock"),
  source_url: new URL("https://source_url_mock"),
  release_notes: true,
  release_notes_name: "release_notes_name_mock",
  timestamp: new Date(Date.UTC(2020, 0, 1)),
  platforms: {
    platform_mock: {
      assets: [
        {
          os: "os_mock",
          architecture: "architecture_mock",
          type: "type_mock",
          link: new URL("https://link_mock"),
          checksum: "checksum_mock",
          size: 0,
          extension: "extension_mock",
          installer_link: installer
            ? new URL("https://installer_link_mock")
            : undefined,
          installer_checksum: installer ? "installer_checksum_mock" : undefined,
          installer_size: installer ? 0 : undefined,
          installer_extension: installer
            ? "installer_extension_mock"
            : undefined,
        },
      ],
    },
  },
});
