import React from "react"
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import ReleaseFilters from "../index"
import * as fetchConstants from "@/hooks/fetchConstants"

// Mock the utilities and hooks
vi.mock("@/utils/setURLParam", () => ({
    setURLParam: vi.fn(),
}))

vi.mock("@/hooks/fetchConstants", () => ({
    useOses: vi.fn(),
    useArches: vi.fn(),
}))

// Mock CommonSelector component
vi.mock("@/components/Common/CommonSelector", () => ({
    default: ({ list, defaultValue, selectorUpdater, 'data-testid': testId, ...props }: {
        list: Array<{ value: string; name: string }>;
        defaultValue?: { value: string; name: string };
        selectorUpdater: (value: string) => void;
        'data-testid'?: string;
        [key: string]: unknown;
    }) => (
        <select
            data-testid={testId}
            value={defaultValue?.value || ""}
            onChange={(e) => selectorUpdater(e.target.value)}
            {...props}
        >
            {list.map((item: { value: string; name: string }) => (
                <option key={item.value} value={item.value}>
                    {item.name}
                </option>
            ))}
        </select>
    ),
}))

// Mock data
const mockVersions = [
    { name: "Java 21", value: "21" },
    { name: "Java 17", value: "17" },
    { name: "Java 11", value: "11" },
    { name: "Java 8", value: "8" },
]

const mockOSOptions = [
    { name: "Linux", value: "linux" },
    { name: "Windows", value: "windows" },
    { name: "Mac", value: "mac" },
]

const mockArchOptions = [
    { name: "x64", value: "x64" },
    { name: "aarch64", value: "aarch64" },
    { name: "x86", value: "x86" },
]

describe("ReleaseFilters component", () => {
    const mockOnFiltersChange = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()

        // Setup mock implementations
        vi.mocked(fetchConstants.useOses).mockReturnValue(mockOSOptions)
        vi.mocked(fetchConstants.useArches).mockReturnValue(mockArchOptions)

        // Mock window.location for setURLParam
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://localhost:3000/',
            },
            writable: true,
        })
    })

    afterEach(() => {
        cleanup()
    })

    it("should render all filter sections", () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        expect(screen.getByTestId("release-filters-section")).toBeInTheDocument()
        expect(screen.getByTestId("filter-title")).toBeInTheDocument()
        expect(screen.getByTestId("version-filter-group")).toBeInTheDocument()
        expect(screen.getByTestId("os-filter-group")).toBeInTheDocument()
        expect(screen.getByTestId("arch-filter-group")).toBeInTheDocument()
        expect(screen.getByTestId("reset-filters-button")).toBeInTheDocument()
    })

    it("should show loading state when versions are not loaded", () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={[]}
                latestLTS={21}
            />
        )

        expect(screen.getByTestId("loading-versions")).toBeInTheDocument()
    })

    it("should initialize with latest LTS version by default", async () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        await waitFor(() => {
            expect(mockOnFiltersChange).toHaveBeenCalledWith("21", "any", "any")
        })
    })

    it("should initialize with URL parameters when provided", async () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "17",
                    os: "linux",
                    arch: "x64"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        await waitFor(() => {
            expect(mockOnFiltersChange).toHaveBeenCalledWith("17", "linux", "x64")
        })
    })

    it("should handle legacy 'latest' version parameter", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "latest"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        await waitFor(() => {
            expect(setURLParam).toHaveBeenCalledWith("version", "21")
            expect(mockOnFiltersChange).toHaveBeenCalledWith("21", "any", "any")
        })
    })

    it("should handle legacy 'any' version parameter", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "any"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        await waitFor(() => {
            expect(setURLParam).toHaveBeenCalledWith("version", "21")
            expect(mockOnFiltersChange).toHaveBeenCalledWith("21", "any", "any")
        })
    })

    it("should fallback to latest LTS for invalid version", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "99" // Invalid version
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        await waitFor(() => {
            expect(setURLParam).toHaveBeenCalledWith("version", "21")
            expect(mockOnFiltersChange).toHaveBeenCalledWith("21", "any", "any")
        })
    })

    it("should ignore invalid OS and architecture parameters", async () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "17",
                    os: "invalid-os",
                    arch: "invalid-arch"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        await waitFor(() => {
            expect(mockOnFiltersChange).toHaveBeenCalledWith("17", "any", "any")
        })
    })

    it("should handle version change and reset other filters", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "21",
                    os: "linux",
                    arch: "x64"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Find the version selector using specific test ID
        const versionSelector = screen.getByTestId("version-selector")

        fireEvent.change(versionSelector, { target: { value: "17" } })

        expect(setURLParam).toHaveBeenCalledWith("version", "17")
        expect(setURLParam).toHaveBeenCalledWith("mode", "filter")
        expect(setURLParam).toHaveBeenCalledWith("os", "any")
        expect(setURLParam).toHaveBeenCalledWith("arch", "any")
        expect(mockOnFiltersChange).toHaveBeenCalledWith("17", "any", "any")
    })

    it("should handle OS change", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "21"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Find the OS selector using specific test ID
        const osSelector = screen.getByTestId("os-selector")

        fireEvent.change(osSelector, { target: { value: "linux" } })

        expect(setURLParam).toHaveBeenCalledWith("os", "linux")
        expect(setURLParam).toHaveBeenCalledWith("mode", "filter")
        expect(mockOnFiltersChange).toHaveBeenCalledWith("21", "linux", "any")
    })

    it("should handle architecture change", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "21"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Find the architecture selector using specific test ID
        const archSelector = screen.getByTestId("arch-selector")

        fireEvent.change(archSelector, { target: { value: "aarch64" } })

        expect(setURLParam).toHaveBeenCalledWith("arch", "aarch64")
        expect(setURLParam).toHaveBeenCalledWith("mode", "filter")
        expect(mockOnFiltersChange).toHaveBeenCalledWith("21", "any", "aarch64")
    })

    it("should handle reset button click", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "17",
                    os: "linux",
                    arch: "x64"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        const resetButton = screen.getByTestId("reset-filters-button")
        fireEvent.click(resetButton)

        expect(setURLParam).toHaveBeenCalledWith("version", "21")
        expect(setURLParam).toHaveBeenCalledWith("os", "any")
        expect(setURLParam).toHaveBeenCalledWith("arch", "any")
        expect(setURLParam).toHaveBeenCalledWith("mode", "filter")

        await waitFor(() => {
            expect(mockOnFiltersChange).toHaveBeenCalledWith("21", "any", "any")
        })
    })

    it("should not reset other filters when changing to same version", async () => {
        const { setURLParam } = await import("@/utils/setURLParam")

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "21",
                    os: "linux",
                    arch: "x64"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Clear previous calls
        vi.clearAllMocks()

        // Find the version selector using specific test ID
        const versionSelector = screen.getByTestId("version-selector")

        fireEvent.change(versionSelector, { target: { value: "21" } })

        // Should not reset OS and arch when version doesn't change
        expect(setURLParam).toHaveBeenCalledWith("version", "21")
        expect(setURLParam).toHaveBeenCalledWith("mode", "filter")
        expect(setURLParam).not.toHaveBeenCalledWith("os", "any")
        expect(setURLParam).not.toHaveBeenCalledWith("arch", "any")
    })

    it("should include 'Any' options in OS and architecture selectors", () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Check that "Any" options are present by checking option values
        const osSelector = screen.getByTestId("os-selector")
        const archSelector = screen.getByTestId("arch-selector")

        expect(osSelector).toHaveDisplayValue("Text") // The mock translation shows as "Text"
        expect(archSelector).toHaveDisplayValue("Text") // The mock translation shows as "Text"

        // Verify the "any" options exist
        expect(osSelector.querySelector('option[value="any"]')).toBeInTheDocument()
        expect(archSelector.querySelector('option[value="any"]')).toBeInTheDocument()
    })

    it("should call hooks with correct parameters", () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        expect(fetchConstants.useOses).toHaveBeenCalledWith(true)
        expect(fetchConstants.useArches).toHaveBeenCalledWith(true)
    })

    it("should render reset button with correct icon and text", () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        const resetButton = screen.getByTestId("reset-filters-button")
        expect(resetButton).toBeInTheDocument()
        expect(resetButton).toHaveClass("flex", "items-center", "gap-2")
    })

    it("should have proper CSS classes for styling", () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Check main section using test ID
        const section = screen.getByTestId("release-filters-section")
        expect(section).toHaveClass("py-10")

        // Check grid layout using test ID
        const grid = screen.getByTestId("filters-grid")
        expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-3", "gap-4")

        // Check reset button styling using test ID
        const resetButton = screen.getByTestId("reset-filters-button")
        expect(resetButton).toHaveClass("bg-[#3E3355]", "hover:bg-[#554772]")
    })

    it("should handle empty hooks data gracefully", () => {
        // Override mock return values for this test
        vi.mocked(fetchConstants.useOses).mockReturnValue([])
        vi.mocked(fetchConstants.useArches).mockReturnValue([])

        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Should still render the component without errors
        expect(screen.getByTestId("filter-title")).toBeInTheDocument()
    })

    it("should trigger onFiltersChange during initialization", async () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{
                    version: "17",
                    os: "linux",
                    arch: "x64"
                }}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        await waitFor(() => {
            // The component may call onFiltersChange multiple times during initialization
            // What matters is that it gets called with the right final values
            const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1]
            expect(lastCall).toEqual(["17", "linux", "x64"])
        })
    })

    it("should have correct test IDs for all selectors", () => {
        render(
            <ReleaseFilters
                onFiltersChange={mockOnFiltersChange}
                initialParams={{}}
                allVersions={mockVersions}
                latestLTS={21}
            />
        )

        // Verify all selectors have unique, descriptive test IDs
        expect(screen.getByTestId("version-selector")).toBeInTheDocument()
        expect(screen.getByTestId("os-selector")).toBeInTheDocument()
        expect(screen.getByTestId("arch-selector")).toBeInTheDocument()
    })
})
