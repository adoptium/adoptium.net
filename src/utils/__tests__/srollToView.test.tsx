import { describe, it, expect, vi } from "vitest"
import { scrollToSection } from "../scrollToView"

// Mock window.scrollTo
vi.spyOn(window, "scrollTo").mockImplementation(() => {})

describe("scrollToSection", () => {
  it("should prevent default event behavior", () => {
    const event = { preventDefault: vi.fn() } as unknown as React.MouseEvent<
      HTMLButtonElement,
      MouseEvent
    >
    const sectionId = "test-section"

    scrollToSection(event, sectionId)

    expect(event.preventDefault).toHaveBeenCalled()
  })

  it("should scroll to the section with correct offset", () => {
    const event = { preventDefault: vi.fn() } as unknown as React.MouseEvent<
      HTMLButtonElement,
      MouseEvent
    >
    const sectionId = "test-section"

    const section = document.createElement("section")
    section.id = sectionId
    document.body.appendChild(section)

    scrollToSection(event, sectionId)

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: -98,
      behavior: "instant",
    })

    document.body.removeChild(section)
  })
})
