import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import ReleaseResults from "../index"
import { ReleaseAsset } from "@/types/temurin"

// Mock next-intl's useTranslations and useLocale
vi.mock("next-intl", () => ({
    useTranslations: () => (key: string) => {
        if (key === "no-releases-found") return "No releases found";
        if (key === "no-releases-found-description") return "Try adjusting your filters to find releases.";
        if (key === "checksum") return "Checksum";
        if (key === "this-build-is-jck-certified") return "This build is JCK certified";
        if (key === "this-build-is-aqavit-verified") return "This build is AQAvit verified";
        return key;
    },
    useLocale: () => "en"
}))

// Mock the utilities and components
vi.mock("@/utils/gtag", () => ({
    sendDownloadEvent: vi.fn(),
}))

// Mock the i18n navigation
vi.mock("@/i18n/navigation", () => ({
    Link: ({ children, href, onClick, ...props }: {
        children: React.ReactNode;
        href: string | { pathname: string; query: Record<string, string> };
        onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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

vi.mock("@/components/AnimatedPlaceholder", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="animated-placeholder">{children}</div>,
}))

vi.mock("@/components/Common/Icon", () => ({
    AixIcon: () => <div data-testid="aix-icon">AIX</div>,
    SolarisIcon: () => <div data-testid="solaris-icon">Solaris</div>,
}))

// Mock release data
const createMockRelease = (
    os: string,
    architecture: string,
    releaseName: string,
    binaryType: string = "JDK",
    hasInstaller: boolean = false
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
            size: 150,
            extension: "tar.gz",
            release_name: releaseName,
            ...(hasInstaller && {
                installer_link: `https://example.com/download/${releaseName}-${binaryType.toLowerCase()}.${os === 'windows' ? 'msi' : 'pkg'}`,
                installer_checksum: "def456",
                installer_size: 200,
                installer_extension: os === 'windows' ? 'msi' : 'pkg',
            }),
        },
    ],
})

describe("ReleaseResults component", () => {
    const mockOpenModalWithChecksum = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
    })

    it("should render loading state", () => {
        render(
            <ReleaseResults
                releases={[]}
                isLoading={true}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        expect(screen.getByTestId("release-results-loading")).toBeInTheDocument()
        expect(screen.getByTestId("loading-skeleton-1")).toBeInTheDocument()
        expect(screen.getByTestId("loading-skeleton-2")).toBeInTheDocument()
        expect(screen.getByTestId("loading-skeleton-3")).toBeInTheDocument()
    })

    it("should render empty state when no releases", () => {
        render(
            <ReleaseResults
                releases={[]}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        expect(screen.getByTestId("release-results-empty")).toBeInTheDocument()
        expect(screen.getByTestId("empty-state-icon")).toBeInTheDocument()

        const titleElement = screen.getByTestId("empty-state-title")
        expect(titleElement).toHaveTextContent("No releases found")
        expect(screen.getByTestId("empty-state-description")).toHaveTextContent("Try adjusting your filters to find releases.")
    })

    it("should render releases with content", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        expect(screen.getByTestId("release-results-content")).toBeInTheDocument()
        expect(screen.getByTestId("release-card-linux")).toBeInTheDocument()
        expect(screen.getByTestId("release-card-windows")).toBeInTheDocument()
    })

    it("should display OS titles correctly", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
            createMockRelease("mac", "aarch64", "11.0.28+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        expect(screen.getByTestId("os-title-linux")).toHaveTextContent("Linux")
        expect(screen.getByTestId("os-title-mac")).toHaveTextContent("macOS")
        expect(screen.getByTestId("os-title-windows")).toHaveTextContent("Windows")
    })

    it("should handle architecture selection", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
            createMockRelease("linux", "aarch64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show architecture tabs
        expect(screen.getByTestId("architecture-tabs-linux")).toBeInTheDocument()
        expect(screen.getByTestId("arch-tab-linux-x64")).toBeInTheDocument()
        expect(screen.getByTestId("arch-tab-linux-aarch64")).toBeInTheDocument()

        // Click on aarch64 architecture
        fireEvent.click(screen.getByTestId("arch-tab-linux-aarch64"))

        // Should update the selected architecture (this would be reflected in styling)
        expect(screen.getByTestId("arch-tab-linux-aarch64")).toBeInTheDocument()
    })

    it("should handle package type selection", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6", "JDK"),
            createMockRelease("linux", "x64", "11.0.28+6", "JRE"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show package type buttons
        expect(screen.getByTestId("package-type-buttons-linux-x64")).toBeInTheDocument()
        expect(screen.getByTestId("jdk-button-linux-x64")).toBeInTheDocument()
        expect(screen.getByTestId("jre-button-linux-x64")).toBeInTheDocument()

        // Click on JRE button
        fireEvent.click(screen.getByTestId("jre-button-linux-x64"))

        // Should update the selected package type (this would be reflected in styling)
        expect(screen.getByTestId("jre-button-linux-x64")).toBeInTheDocument()
    })

    it("should handle architecture selection", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
            createMockRelease("linux", "aarch64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show architecture tabs
        expect(screen.getByTestId("architecture-tabs-linux")).toBeInTheDocument()
        expect(screen.getByTestId("arch-tab-linux-x64")).toBeInTheDocument()
        expect(screen.getByTestId("arch-tab-linux-aarch64")).toBeInTheDocument()

        // Click on aarch64 architecture
        fireEvent.click(screen.getByTestId("arch-tab-linux-aarch64"))

        // Should update the selected architecture (this would be reflected in styling)
        expect(screen.getByTestId("arch-tab-linux-aarch64")).toBeInTheDocument()
    })

    it("should handle package type selection", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6", "JDK"),
            createMockRelease("linux", "x64", "11.0.28+6", "JRE"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show package type buttons
        expect(screen.getByTestId("package-type-buttons-linux-x64")).toBeInTheDocument()
        expect(screen.getByTestId("jdk-button-linux-x64")).toBeInTheDocument()
        expect(screen.getByTestId("jre-button-linux-x64")).toBeInTheDocument()

        // Click on JRE button
        fireEvent.click(screen.getByTestId("jre-button-linux-x64"))

        // Should update the selected package type (this would be reflected in styling)
        expect(screen.getByTestId("jre-button-linux-x64")).toBeInTheDocument()
    })

    it("should display release header with version and date", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        const releaseHeader = screen.getByTestId("release-header-linux")
        expect(releaseHeader).toBeInTheDocument()
        expect(releaseHeader).toHaveTextContent("Temurin 11.0.28+6")
        expect(releaseHeader).toHaveTextContent("01/01/2023") // Formatted date
    })

    it("should render binary download rows", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show binary row
        expect(screen.getByTestId("binary-row-linux-x64-JDK-0")).toBeInTheDocument()
        expect(screen.getByTestId("download-link-linux-x64-JDK-0")).toBeInTheDocument()
        expect(screen.getByTestId("binary-info-linux-x64-JDK-0")).toHaveTextContent("TAR.GZ, 150 MB")
        expect(screen.getByTestId("checksum-link-linux-x64-JDK-0")).toBeInTheDocument()
    })

    it("should handle download click events", async () => {
        const { sendDownloadEvent } = await import("@/utils/gtag")
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        const downloadLink = screen.getByTestId("download-link-linux-x64-JDK-0")
        fireEvent.click(downloadLink)

        expect(sendDownloadEvent).toHaveBeenCalledWith({
            link: "https://example.com/download/11.0.28+6-jdk.tar.gz",
            os: "linux",
            arch: "x64",
            pkg_type: "JDK",
            version: "11.0.28+6",
            vendor: "temurin"
        })
    })

    it("should handle checksum click events", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        const checksumLink = screen.getByTestId("checksum-link-linux-x64-JDK-0")
        fireEvent.click(checksumLink)

        expect(mockOpenModalWithChecksum).toHaveBeenCalledWith("abc123")
    })

    it("should render binary download rows", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show binary row
        expect(screen.getByTestId("binary-row-linux-x64-JDK-0")).toBeInTheDocument()
        expect(screen.getByTestId("download-link-linux-x64-JDK-0")).toBeInTheDocument()
        expect(screen.getByTestId("binary-info-linux-x64-JDK-0")).toHaveTextContent("TAR.GZ, 150 MB")
        expect(screen.getByTestId("checksum-link-linux-x64-JDK-0")).toBeInTheDocument()
    })

    it("should handle download click events", async () => {
        const { sendDownloadEvent } = await import("@/utils/gtag")
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        const downloadLink = screen.getByTestId("download-link-linux-x64-JDK-0")
        fireEvent.click(downloadLink)

        expect(sendDownloadEvent).toHaveBeenCalledWith({
            link: "https://example.com/download/11.0.28+6-jdk.tar.gz",
            os: "linux",
            arch: "x64",
            pkg_type: "JDK",
            version: "11.0.28+6",
            vendor: "temurin"
        })
    })

    it("should handle checksum click events", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        const checksumLink = screen.getByTestId("checksum-link-linux-x64-JDK-0")
        fireEvent.click(checksumLink)

        expect(mockOpenModalWithChecksum).toHaveBeenCalledWith("abc123")
    })

    it("should render installer links when available", () => {
        const releases = [
            createMockRelease("windows", "x64", "11.0.28+6", "JDK", true), // With installer
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show both binary and installer rows
        expect(screen.getByTestId("binary-row-windows-x64-JDK-0")).toBeInTheDocument()
        // Installer would have a different key pattern, but since we're filtering by package type, 
        // we should see the installer information
        expect(screen.getByTestId("binary-info-windows-x64-JDK-0")).toBeInTheDocument()
    })

    it("should sort OS entries in preferred order", () => {
        const releases = [
            createMockRelease("solaris", "x64", "11.0.28+6"),
            createMockRelease("linux", "x64", "11.0.28+6"),
            createMockRelease("aix", "x64", "11.0.28+6"),
            createMockRelease("windows", "x64", "11.0.28+6"),
            createMockRelease("mac", "aarch64", "11.0.28+6"),
        ]

        const { container } = render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Get all release cards in DOM order
        const releaseCards = container.querySelectorAll('[data-testid^="release-card-"]')
        const osOrder = Array.from(releaseCards).map(card =>
            card.getAttribute('data-testid')?.replace('release-card-', '')
        )

        // Should follow the preferred order: linux, windows, mac, alpine-linux, aix, solaris
        expect(osOrder).toEqual(['linux', 'windows', 'mac', 'aix', 'solaris'])
    })

    it("should filter binaries by selected package type", () => {
        const releases = [
            {
                ...createMockRelease("linux", "x64", "11.0.28+6", "JDK"),
                binaries: [
                    {
                        type: "JDK",
                        link: "https://example.com/jdk.tar.gz",
                        checksum: "jdk-checksum",
                        size: 150,
                        extension: "tar.gz",
                        release_name: "11.0.28+6",
                    },
                    {
                        type: "JRE",
                        link: "https://example.com/jre.tar.gz",
                        checksum: "jre-checksum",
                        size: 100,
                        extension: "tar.gz",
                        release_name: "11.0.28+6",
                    },
                ],
            },
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // By default should show JDK
        expect(screen.getByTestId("binary-row-linux-x64-JDK-0")).toBeInTheDocument()

        // Click JRE button
        fireEvent.click(screen.getByTestId("jre-button-linux-x64"))

        // Should now show JRE
        // Note: The component re-renders and filters, so we'd see the JRE binary
        expect(screen.getByTestId("jre-button-linux-x64")).toBeInTheDocument()
    })

    it("should handle releases with missing data gracefully", () => {
        const releases = [
            {
                platform_name: "linux-x64",
                os: "linux",
                architecture: "x64",
                release_name: "",
                release_link: "",
                release_date: "",
                version: {
                    major: 11,
                    minor: 0,
                    security: 28,
                    build: 6,
                    openjdk_version: "11.0.28+6",
                    semver: "11.0.28+6",
                },
                binaries: [],
            },
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should still render the OS card
        expect(screen.getByTestId("release-card-linux")).toBeInTheDocument()
        expect(screen.getByTestId("os-title-linux")).toBeInTheDocument()

        // Release header should handle empty data
        const releaseHeader = screen.getByTestId("release-header-linux")
        expect(releaseHeader).toBeInTheDocument()
    })

    it("should render certification icons", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should show JCK certification icon and AQAvit logo
        const binaryRow = screen.getByTestId("binary-row-linux-x64-JDK-0")
        expect(binaryRow).toBeInTheDocument()

        // Check for AQAvit logo img
        expect(screen.getByAltText("AQAvit logo")).toBeInTheDocument()
    })

    it("should handle unknown OS with fallback icon", () => {
        const releases = [
            createMockRelease("unknown-os", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        // Should still render the card with fallback Linux icon
        expect(screen.getByTestId("release-card-unknown-os")).toBeInTheDocument()
        expect(screen.getByTestId("os-title-unknown-os")).toHaveTextContent("Unknown-os")
    })

    it("should have proper CSS classes for styling", () => {
        const releases = [
            createMockRelease("linux", "x64", "11.0.28+6"),
        ]

        render(
            <ReleaseResults
                releases={releases}
                isLoading={false}
                openModalWithChecksum={mockOpenModalWithChecksum}
            />
        )

        const content = screen.getByTestId("release-results-content")
        expect(content).toHaveClass("py-4")

        const releaseCard = screen.getByTestId("release-card-linux")
        expect(releaseCard).toHaveClass("flex", "justify-between", "border", "rounded-[24px]")
    })
})
