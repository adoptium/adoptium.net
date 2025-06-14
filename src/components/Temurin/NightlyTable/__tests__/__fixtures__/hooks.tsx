import { TemurinReleases } from "@/hooks"

export const createRandomTemurinReleases = (installer: boolean): TemurinReleases => ({
    release_name: "release_name_mock",
    release_link: new URL("https://release_link_mock"),
    source_url: new URL("https://source_url_mock"),
    release_notes: true,
    release_notes_name: 'release_notes_name_mock',
    timestamp: new Date(Date.UTC(2020, 0, 1)).toISOString(),
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
})