import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import OneClickDownload from "../index"
import { ReleaseAsset } from "@/types/temurin"

// Mock the utilities
vi.mock("@/utils/gtag", () => ({
    sendDownloadEvent: vi.fn(),
}))

// Mock the i18n navigation
vi.mock("@/i18n/navigation", () => ({
    Link: ({ children, href, onClick, ...props }: { 
        children: React.ReactNode; 
        href: string | { pathname: string; query: Record<string, string> }; 
        onClick?: (e: React.MouseEvent) => void;
        [key: string]: unknown;
    }) => (
        <a
            href={typeof href === 'string' ? href : `${href.pathname}?${new URLSearchParams(href.query).toString()}`}
            onClick={e => {
                e.preventDefault()
                if (onClick) onClick(e)
            }}
            {...props}
        >
            {children}
        </a>
    ),
}))

// Mock release data
const createMockRelease = (
    os: string,
    architecture: string,
    releaseName: string,
    binaryType: string = "JDK",
    hasInstaller: boolean = true
): ReleaseAsset => ({
    platform_name: `${os}-${architecture}`,
    os,
    architecture,
    release_name: releaseName,
    release_link: `https://example.com/releases/${releaseName}`,
    release_date: "2023-01-01T00:00:00Z",
    version: {
        major: 11,
        minor: 0,
        security: 28,
        build: 6,
        openjdk_version: "11.0.28+6",
        semver: "11.0.28+6",
    },
    binaries: [
        {
            type: binaryType,
            link: `https://example.com/download/${releaseName}-${binaryType.toLowerCase()}.tar.gz`,
            checksum: "abc123",
            size: 123456789,
            extension: "tar.gz",
            release_name: releaseName,
            ...(hasInstaller && {
                installer_link: `https://example.com/download/${releaseName}-${binaryType.toLowerCase()}.${os === 'windows' ? 'msi' : 'pkg'}`,
                installer_checksum: "def456",
                installer_size: 87654321,
                installer_extension: os === 'windows' ? 'msi' : 'pkg',
            }),
        },
    ],
})

describe("OneClickDownload component", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
    })

    it("should render nothing when no releases are provided", () => {
        const { container } = render(
            <OneClickDownload selectedVersion="11" releases={[]} />
        )

        expect(container.firstChild).toBeNull()
    })

    it("should render macOS and Windows download cards with default versions", () => {
        const releases = [
            createMockRelease("mac", "aarch64", "11.0.28+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        // Check that both cards are rendered
        expect(screen.getByRole("heading", { name: "macOS" })).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Windows" })).toBeInTheDocument()

        // Check that download links are present
        expect(screen.getByLabelText("Download macOS package")).toBeInTheDocument()
        expect(screen.getByLabelText("Download Windows package")).toBeInTheDocument()
    })

    it("should prioritize macOS ARM over x64", () => {
        const releases = [
            createMockRelease("mac", "x64", "11.0.27+6"),
            createMockRelease("mac", "aarch64", "11.0.28+6"),
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        // Should show ARM version (11.0.28+6) not x64 version (11.0.27+6)
        expect(screen.getByText("Temurin 11.0.28+6, macOS aarch64 (M1) (.PKG)")).toBeInTheDocument()
    })

    it("should fall back to x64 when ARM is not available", () => {
        const releases = [
            createMockRelease("mac", "x64", "11.0.27+6"),
            createMockRelease("windows", "x64", "11.0.27+6"),
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        expect(screen.getByText("Temurin 11.0.27+6, macOS x64 (.PKG)")).toBeInTheDocument()
    })

    it("should prioritize JDK over JRE", () => {
        const releases = [
            createMockRelease("mac", "aarch64", "11.0.28+6", "JRE"),
            createMockRelease("mac", "aarch64", "11.0.28+6", "JDK"),
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        // Should show JDK version
        expect(screen.getByText("Temurin 11.0.28+6, macOS aarch64 (M1) (.PKG)")).toBeInTheDocument()
    })

    it("should prefer installer links over archive links", () => {
        const releases = [
            createMockRelease("mac", "aarch64", "11.0.28+6", "JDK", false), // No installer
            createMockRelease("windows", "x64", "11.0.28+6", "JDK", true), // Has installer
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        // macOS should show archive format since no installer
        expect(screen.getByText("Temurin 11.0.28+6, macOS aarch64 (M1) (.TAR.GZ)")).toBeInTheDocument()
        // Windows should show installer format
        expect(screen.getByText("Temurin 11.0.28+6, Windows 64 bit (.MSI)")).toBeInTheDocument()
    })

    it("should show different versions for different platforms", () => {
        const releases = [
            createMockRelease("mac", "aarch64", "11.0.27+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        // Should show correct version for each platform
        expect(screen.getByText("Temurin 11.0.27+6, macOS aarch64 (M1) (.PKG)")).toBeInTheDocument()
        expect(screen.getByText("Temurin 11.0.28+6, Windows 64 bit (.MSI)")).toBeInTheDocument()
    })

    it("should handle click events and call sendDownloadEvent", async () => {
        const { sendDownloadEvent } = await import("@/utils/gtag")
        const releases = [
            createMockRelease("mac", "aarch64", "11.0.28+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        const macOSLink = screen.getByLabelText("Download macOS package")
        const windowsLink = screen.getByLabelText("Download Windows package")

        fireEvent.click(macOSLink)
        fireEvent.click(windowsLink)

        expect(sendDownloadEvent).toHaveBeenCalledTimes(2)
        expect(sendDownloadEvent).toHaveBeenCalledWith({
            link: "https://example.com/download/11.0.28+6-jdk.pkg",
            os: "mac",
            arch: "aarch64",
            pkg_type: "jdk",
            version: "11.0.28+6",
            vendor: "Adoptium",
        })
        expect(sendDownloadEvent).toHaveBeenCalledWith({
            link: "https://example.com/download/11.0.28+6-jdk.msi",
            os: "windows",
            arch: "x64",
            pkg_type: "jdk",
            version: "11.0.28+6",
            vendor: "Adoptium",
        })
    })

    it("should generate correct download URLs", () => {
        const releases = [
            createMockRelease("mac", "aarch64", "11.0.28+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        const macOSLink = screen.getByLabelText("Download macOS package")
        const windowsLink = screen.getByLabelText("Download Windows package")

        expect(macOSLink).toHaveAttribute(
            "href",
            "/download?link=https%3A%2F%2Fexample.com%2Fdownload%2F11.0.28%2B6-jdk.pkg&vendor=Adoptium"
        )
        expect(windowsLink).toHaveAttribute(
            "href",
            "/download?link=https%3A%2F%2Fexample.com%2Fdownload%2F11.0.28%2B6-jdk.msi&vendor=Adoptium"
        )
    })

    it("should handle edge case with no valid binaries", () => {
        const releases: ReleaseAsset[] = [
            {
                platform_name: "mac-aarch64",
                os: "mac",
                architecture: "aarch64",
                release_name: "11.0.28+6",
                release_link: "https://example.com/releases/11.0.28+6",
                release_date: "2023-01-01T00:00:00Z",
                version: {
                    major: 11,
                    minor: 0,
                    security: 28,
                    build: 6,
                    openjdk_version: "11.0.28+6",
                    semver: "11.0.28+6",
                },
                binaries: [], // No binaries
            },
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        // Should still render the cards but with default fallback text
        expect(screen.getByRole("heading", { name: "macOS" })).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Windows" })).toBeInTheDocument()
        // Both cards will show the same fallback text, so use getAllByText
        expect(screen.getAllByText("Temurin 11.0.28+6")).toHaveLength(2)
    })

    it("should track architecture correctly in analytics for x64 fallback", async () => {
        const { sendDownloadEvent } = await import("@/utils/gtag")
        const releases = [
            createMockRelease("mac", "x64", "11.0.27+6"), // Only x64, no ARM
        ]

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        const macOSLink = screen.getByLabelText("Download macOS package")
        fireEvent.click(macOSLink)

        expect(sendDownloadEvent).toHaveBeenCalledWith({
            link: "https://example.com/download/11.0.27+6-jdk.pkg",
            os: "mac",
            arch: "x64", // Should be x64, not aarch64
            pkg_type: "jdk",
            version: "11.0.27+6",
            vendor: "Adoptium",
        })
    })

    it("should render with correct CSS classes and styling", () => {
        const releases = [
            createMockRelease("mac", "aarch64", "11.0.28+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
        ]

        const { container } = render(
            <OneClickDownload selectedVersion="11" releases={releases} />
        )

        // Check main container classes
        const mainContainer = container.querySelector('.flex.justify-between.flex-col.md\\:flex-row')
        expect(mainContainer).toBeInTheDocument()

        // Check card styling
        const cards = container.querySelectorAll('.bg-\\[\\#200E46\\]')
        expect(cards).toHaveLength(2)
    })

    it("should handle selectedVersion fallback when first release is undefined", () => {
        const releases: ReleaseAsset[] = []

        render(<OneClickDownload selectedVersion="11" releases={releases} />)

        // Should return null for empty releases
        expect(screen.queryByRole("heading", { name: "macOS" })).not.toBeInTheDocument()
        expect(screen.queryByRole("heading", { name: "Windows" })).not.toBeInTheDocument()
    })
})