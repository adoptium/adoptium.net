import * as React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import { vi, describe, test, beforeEach, expect } from "vitest"
import VendorSelector from "../index"
import vendors from "@/data/marketplace.json"
import getVendorIdentifier from "@/utils/vendors"

// Mock the shuffle function to return the array unchanged (for predictable testing)
vi.mock("@/utils/shuffle", () => ({
    shuffle: (arr: unknown[]) => arr,
}))

vi.mock("next-intl", () => ({
    useTranslations: () => (key: string, options?: { selected: number; total: number }) => {
        if (key === "vendors-selected" && options) {
            return `${options.selected} of ${options.total} vendors selected`
        }
        return key
    },
}))

describe("Marketplace VendorSelector", () => {
    const mockSetSelectedVendorIdentifiers = vi.fn()
    const initialSelectedVendors = vendors.map(v => getVendorIdentifier(v))

    beforeEach(() => {
        mockSetSelectedVendorIdentifiers.mockClear()
    })

    test("renders all vendors correctly", () => {
        render(
            <VendorSelector
                selectedVendorIdentifiers={initialSelectedVendors}
                setSelectedVendorIdentifiers={mockSetSelectedVendorIdentifiers}
            />
        )

        // Check if component renders the correct count text
        expect(screen.getByText(`${initialSelectedVendors.length} of ${vendors.length} vendors selected`)).toBeInTheDocument()

        // Check if all vendor buttons are rendered
        const vendorButtons = screen.getAllByRole("button")
        expect(vendorButtons.length).toBe(vendors.length)

        // Check if all vendor images are present
        vendors.forEach(vendor => {
            expect(screen.getByAltText(`${vendor.name} icon`)).toBeInTheDocument()
            expect(screen.getByText(vendor.name)).toBeInTheDocument()
        })
    })

    test("toggling a vendor calls setSelectedVendorIdentifiers", async () => {
        render(
            <VendorSelector
                selectedVendorIdentifiers={initialSelectedVendors}
                setSelectedVendorIdentifiers={mockSetSelectedVendorIdentifiers}
            />
        )

        // First vendor button (disambiguate by index)
        const firstVendor = vendors[0]
        const vendorButtons = screen.getAllByTitle(firstVendor.name)
        // Pick the first visible button (should be the one in the main vendor bar)
        const vendorButton = vendorButtons[0]

        // Click the button to toggle selection
        fireEvent.click(vendorButton)

        // Check if setSelectedVendorIdentifiers was called with the updated array
        // The first call is from the useEffect, the second from the click
        expect(mockSetSelectedVendorIdentifiers).toHaveBeenCalledTimes(2)
    })

    test("unselected vendors have greyscale styling", () => {
        // Render with only the first vendor selected
        const firstVendorIdentifier = getVendorIdentifier(vendors[0])

        render(
            <VendorSelector
                selectedVendorIdentifiers={[firstVendorIdentifier]}
                setSelectedVendorIdentifiers={mockSetSelectedVendorIdentifiers}
            />
        )

        // Get the second vendor which should be unselected
        const secondVendor = vendors[1]

        // There may be multiple images with the same alt, so use getAllByAltText
        const allImgs = screen.getAllByAltText(`${secondVendor.name} icon`)
        // Find the first image with the grayscale class
        const secondVendorImg = allImgs.find(img => img.className.includes("grayscale"))
        expect(secondVendorImg).toBeTruthy()

        // Check that the second vendor's button doesn't have selected styles
        const allButtons = screen.getAllByTitle(secondVendor.name)
        // Find the button that is not selected
        const secondVendorButton = allButtons.find(btn => !btn.className.includes("border-pink-500"))
        expect(secondVendorButton).toBeTruthy()
    })
})
