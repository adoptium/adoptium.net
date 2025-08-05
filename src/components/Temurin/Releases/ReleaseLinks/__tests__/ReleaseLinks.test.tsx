import React from "react"
import { render, screen, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import ReleaseLinks from "../index"
import { ReleaseAsset } from "@/types/temurin"
import { TemurinReleaseAssets } from "@/hooks/fetchTemurinReleases"

// Mock the i18n navigation
vi.mock("@/i18n/navigation", () => ({
    Link: ({ children, href, target, ...props }: {
        children: React.ReactNode;
        href: string;
        target?: string;
        [key: string]: unknown;
    }) => (
        <a href={href} target={target} {...props}>
            {children}
        </a>
    ),
}))

// Mock release data factory
const createMockRelease = (
    os: string = "linux",
    architecture: string = "x64",
    releaseName: string = "jdk-21.0.1+12"
): ReleaseAsset => ({
    platform_name: `${os}-${architecture}`,
    os,
    architecture,
    release_name: releaseName,
    release_link: `https://example.com/releases/${releaseName}`,
    release_date: "2023-01-01T00:00:00Z",
    version: {
        major: 21,
        minor: 0,
        security: 1,
        build: 12,
        openjdk_version: "21.0.1+12",
        semver: "21.0.1+12",
    },
    binaries: [
        {
            type: "JDK",
            link: `https://example.com/download/${releaseName}.tar.gz`,
            checksum: "abc123",
            size: 123456789,
            extension: "tar.gz",
            release_name: releaseName,
        },
    ],
})

// Mock TemurinReleaseAssets with source property
const createMockTemurinReleaseAssets = (
    releases: ReleaseAsset[],
    sourceRelease?: {
        release_name: string
        binary?: {
            package?: {
                link: string
            }
        }
    }
): TemurinReleaseAssets => {
    const assets = [...releases] as TemurinReleaseAssets
    if (sourceRelease) {
        assets.source = sourceRelease as {
            release_name: string;
            binary?: {
                package?: {
                    link: string;
                };
            };
        }
    }
    return assets
}

describe("ReleaseLinks component", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
    })

    it("should render nothing when no releases are provided", () => {
        const { container } = render(
            <ReleaseLinks selectedVersion="21" releases={[]} />
        )

        expect(container.firstChild).toBeNull()
    })

    it("should render all link sections when releases are provided", () => {
        const releases = [createMockRelease()]

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        expect(screen.getByTestId("release-links-section")).toBeInTheDocument()
        expect(screen.getByTestId("release-links-list")).toBeInTheDocument()
        expect(screen.getByTestId("release-notes-link")).toBeInTheDocument()
        expect(screen.getByTestId("installation-guide-link")).toBeInTheDocument()
        expect(screen.getByTestId("supported-platforms-link")).toBeInTheDocument()
        expect(screen.getByTestId("source-code-link")).toBeInTheDocument()
    })

    it("should render correct data-testid attributes for accessibility", () => {
        const releases = [createMockRelease()]

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        expect(screen.getByTestId("release-notes-link")).toBeInTheDocument()
        expect(screen.getByTestId("installation-guide-link")).toBeInTheDocument()
        expect(screen.getByTestId("supported-platforms-link")).toBeInTheDocument()
        expect(screen.getByTestId("source-code-link")).toBeInTheDocument()
    })

    it("should generate default release notes URL when no source is available", () => {
        const releases = [createMockRelease()]

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        const releaseNotesLink = screen.getByTestId("release-notes-link").closest('a')
        expect(releaseNotesLink).toHaveAttribute("href", "/temurin/release-notes")
    })

    it("should generate versioned release notes URL when source is available", () => {
        const releases = createMockTemurinReleaseAssets(
            [createMockRelease()],
            { release_name: "jdk-21.0.1+12" }
        )

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        const releaseNotesLink = screen.getByTestId("release-notes-link").closest('a')
        expect(releaseNotesLink).toHaveAttribute("href", "/temurin/release-notes/?version=jdk-21.0.1+12")
    })

    it("should render correct static URLs for installation guide and supported platforms", () => {
        const releases = [createMockRelease()]

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        const installationLink = screen.getByTestId("installation-guide-link").closest('a')
        const platformsLink = screen.getByTestId("supported-platforms-link").closest('a')

        expect(installationLink).toHaveAttribute("href", "/installation")
        expect(platformsLink).toHaveAttribute("href", "/supported-platforms")
    })

    it("should use source package link when available", () => {
        const sourcePackageLink = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.1%2B12/OpenJDK21U-sources_21.0.1_12.tar.gz"
        const releases = createMockTemurinReleaseAssets(
            [createMockRelease()],
            {
                release_name: "jdk-21.0.1+12",
                binary: {
                    package: {
                        link: sourcePackageLink
                    }
                }
            }
        )

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
        expect(sourceCodeLink).toHaveAttribute("href", sourcePackageLink)
        expect(sourceCodeLink).toHaveAttribute("target", "_blank")
    })

    it("should generate GitHub binaries URL when no source package is available", () => {
        const releases = [createMockRelease()]

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
        expect(sourceCodeLink).toHaveAttribute("href", "https://github.com/adoptium/temurin21-binaries")
        expect(sourceCodeLink).toHaveAttribute("target", "_blank")
    })

    it("should handle different version numbers for GitHub URL generation", () => {
        const testCases = [
            { version: "8", expectedUrl: "https://github.com/adoptium/temurin8-binaries" },
            { version: "11", expectedUrl: "https://github.com/adoptium/temurin11-binaries" },
            { version: "17", expectedUrl: "https://github.com/adoptium/temurin17-binaries" },
            { version: "21", expectedUrl: "https://github.com/adoptium/temurin21-binaries" },
        ]

        testCases.forEach(({ version, expectedUrl }) => {
            const { unmount } = render(
                <ReleaseLinks selectedVersion={version} releases={[createMockRelease()]} />
            )

            const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
            expect(sourceCodeLink).toHaveAttribute("href", expectedUrl)

            unmount()
        })
    })

    it("should fallback to # for invalid version numbers", () => {
        const releases = [createMockRelease()]

        render(
            <ReleaseLinks selectedVersion="invalid" releases={releases} />
        )

        const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
        expect(sourceCodeLink).toHaveAttribute("href", "#")
    })

    it("should handle empty source property gracefully", () => {
        const releases = createMockTemurinReleaseAssets(
            [createMockRelease()],
            { release_name: "jdk-21.0.1+12" } // No binary property
        )

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        // Should fallback to GitHub binaries URL
        const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
        expect(sourceCodeLink).toHaveAttribute("href", "https://github.com/adoptium/temurin21-binaries")
    })

    it("should handle source with empty binary property", () => {
        const releases = createMockTemurinReleaseAssets(
            [createMockRelease()],
            {
                release_name: "jdk-21.0.1+12",
                binary: {} // Empty binary object
            }
        )

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        // Should fallback to GitHub binaries URL
        const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
        expect(sourceCodeLink).toHaveAttribute("href", "https://github.com/adoptium/temurin21-binaries")
    })

    it("should render with correct CSS classes and structure", () => {
        const releases = [createMockRelease()]

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        const section = screen.getByTestId("release-links-section")
        const list = screen.getByTestId("release-links-list")

        expect(section).toHaveClass("w-full", "max-w-[1264px]", "mx-auto")
        expect(list).toHaveClass("flex", "md:flex-row", "flex-col", "gap-4", "lg:gap-8")

        // Check that all links have proper styling classes
        const links = [
            screen.getByTestId("release-notes-link"),
            screen.getByTestId("installation-guide-link"),
            screen.getByTestId("supported-platforms-link"),
            screen.getByTestId("source-code-link"),
        ]

        links.forEach(link => {
            expect(link).toHaveClass(
                "flex", "gap-3", "group", "items-center", "text-white",
                "hover:text-primary", "transition-all", "duration-300",
                "ease-in-out", "text-xl", "font-normal", "cursor-pointer"
            )
        })
    })

    it("should handle TemurinReleaseAssets type correctly", () => {
        const mockReleases: TemurinReleaseAssets = createMockTemurinReleaseAssets(
            [createMockRelease("linux", "x64", "jdk-21.0.2+13")],
            {
                release_name: "jdk-21.0.2+13",
                binary: {
                    package: {
                        link: "https://example.com/source.tar.gz"
                    }
                }
            }
        )

        render(
            <ReleaseLinks selectedVersion="21" releases={mockReleases} />
        )

        // Should use the source package link
        const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
        expect(sourceCodeLink).toHaveAttribute("href", "https://example.com/source.tar.gz")

        // Should use versioned release notes URL
        const releaseNotesLink = screen.getByTestId("release-notes-link").closest('a')
        expect(releaseNotesLink).toHaveAttribute("href", "/temurin/release-notes/?version=jdk-21.0.2+13")
    })

    it("should render all required icons", () => {
        const releases = [createMockRelease()]

        const { container } = render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        // Check that all links contain SVG icons (React Icons render as SVGs)
        const links = container.querySelectorAll('[data-testid$="-link"]')
        expect(links).toHaveLength(4)

        links.forEach(link => {
            const svg = link.querySelector('svg')
            expect(svg).toBeInTheDocument()
        })
    })

    it("should handle edge case with numeric string versions", () => {
        const testVersions = ["8", "11", "17", "21", "22"]

        testVersions.forEach(version => {
            const { unmount } = render(
                <ReleaseLinks selectedVersion={version} releases={[createMockRelease()]} />
            )

            const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')
            expect(sourceCodeLink).toHaveAttribute("href", `https://github.com/adoptium/temurin${version}-binaries`)

            unmount()
        })
    })

    it("should maintain link functionality and attributes", () => {
        const releases = createMockTemurinReleaseAssets(
            [createMockRelease()],
            {
                release_name: "jdk-21.0.1+12",
                binary: {
                    package: {
                        link: "https://example.com/source.tar.gz"
                    }
                }
            }
        )

        render(
            <ReleaseLinks selectedVersion="21" releases={releases} />
        )

        const releaseNotesLink = screen.getByTestId("release-notes-link").closest('a')
        const installationLink = screen.getByTestId("installation-guide-link").closest('a')
        const platformsLink = screen.getByTestId("supported-platforms-link").closest('a')
        const sourceCodeLink = screen.getByTestId("source-code-link").closest('a')

        // Check internal links don't have target="_blank"
        expect(releaseNotesLink).not.toHaveAttribute("target")
        expect(installationLink).not.toHaveAttribute("target")
        expect(platformsLink).not.toHaveAttribute("target")

        // Check external source code link has target="_blank"
        expect(sourceCodeLink).toHaveAttribute("target", "_blank")
    })
})
