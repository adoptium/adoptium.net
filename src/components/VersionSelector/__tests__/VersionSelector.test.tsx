import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import VersionSelector from "../index"
import { setURLParam } from "@/utils/setURLParam"

// Mock the setURLParam utility
vi.mock("@/utils/setURLParam", () => ({
  setURLParam: vi.fn(),
}))

describe("VersionSelector component", () => {
  const mockProps = {
    activeVersionTab: 1,
    setActiveVersionTab: vi.fn(),
    versions: [
      {
        name: "8",
        value: 8
      },
      {
        name: "11",
        value: 11
      },
      {
        name: "17",
        value: 17
      },
    ],
    updateVersion: vi.fn(),
    defaultVersion: "latest",
    updateOS: vi.fn(),
    updateArch: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders correctly", () => {
    const { container } = render(<VersionSelector {...mockProps} />)
    expect(container).toMatchSnapshot()
  })

  it("renders 'All Versions' button and version buttons", () => {
    const { container } = render(<VersionSelector {...mockProps} />)

    // Get all buttons
    const buttons = container.querySelectorAll('button');

    // Check for button content by getting the text content
    expect(buttons[0].textContent).toContain("All Versions")
    expect(buttons[1].textContent).toContain("JDK 8")
    expect(buttons[2].textContent).toContain("JDK 11")
    expect(buttons[3].textContent).toContain("JDK 17")
  })

  it("highlights the active version tab", () => {
    const activeProps = {
      ...mockProps,
      activeVersionTab: 11,
    }

    const { container } = render(<VersionSelector {...activeProps} />)

    // Use container.querySelector to find the elements by their exact position
    // Find the first button (All Versions) and the third button (JDK 11)
    const buttons = container.querySelectorAll('button');
    const allVersionsSpan = buttons[0].querySelector('span');
    const jdk11Span = buttons[2].querySelector('span');

    // Check correct classes are applied
    expect(allVersionsSpan).toHaveClass("text-[#8a809e]")
    expect(allVersionsSpan).toHaveClass("border-transparent")

    expect(jdk11Span).toHaveClass("text-white")
    expect(jdk11Span).toHaveClass("border-primary")
    expect(jdk11Span).toHaveClass("border-b-[2px]")
  })

  it("calls setActiveTabVersion with default version when 'All Versions' is clicked", () => {
    const { container } = render(<VersionSelector {...mockProps} />)

    // Get the All Versions button directly by its position
    const buttons = container.querySelectorAll('button');
    const allVersionsButton = buttons[0];

    // Click on "All Versions" button
    fireEvent.click(allVersionsButton)

    // Verify the callbacks
    expect(setURLParam).toHaveBeenCalledWith("version", "latest")
    expect(mockProps.updateVersion).toHaveBeenCalledWith("latest")
    expect(mockProps.setActiveVersionTab).toHaveBeenCalledWith(1)

    // Verify OS and arch are reset to "any"
    expect(setURLParam).toHaveBeenCalledWith("os", "any")
    expect(mockProps.updateOS).toHaveBeenCalledWith("any")
    expect(setURLParam).toHaveBeenCalledWith("arch", "any")
    expect(mockProps.updateArch).toHaveBeenCalledWith("any")
  })

  it("calls setActiveTabVersion with specific version when a version button is clicked", () => {
    const { container } = render(<VersionSelector {...mockProps} />)

    // Get the JDK 11 button directly by its position (third button)
    const buttons = container.querySelectorAll('button');
    const jdk11Button = buttons[2]; // Index 2 corresponds to the third button (JDK 11)

    // Click on JDK 11 button
    fireEvent.click(jdk11Button)

    // Verify the callbacks
    expect(setURLParam).toHaveBeenCalledWith("version", 11)
    expect(mockProps.updateVersion).toHaveBeenCalledWith(11)
    expect(mockProps.setActiveVersionTab).toHaveBeenCalledWith(11)

    // Verify OS and arch are reset to "any"
    expect(setURLParam).toHaveBeenCalledWith("os", "any")
    expect(mockProps.updateOS).toHaveBeenCalledWith("any")
    expect(setURLParam).toHaveBeenCalledWith("arch", "any")
    expect(mockProps.updateArch).toHaveBeenCalledWith("any")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<VersionSelector {...mockProps} />)
    const results = await axe(container)

    // Check for violations
    expect(results.violations.length).toBe(0)
  })
})