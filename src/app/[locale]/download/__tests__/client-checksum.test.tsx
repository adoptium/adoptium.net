/**
 * Tests for the optional `checksum` query parameter on the download page.
 */
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"

const VALID_CHECKSUM =
  "A1B2C3D4E5F60718293A4B5C6D7E8F90A1B2C3D4E5F60718293A4B5C6D7E8F90"

const checksumRef: { current: string | null } = { current: null }

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string): string | null => {
      if (key === "link")
        return "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U.tar.gz"
      if (key === "vendor") return "Adoptium"
      if (key === "checksum") return checksumRef.current
      return null
    },
  }),
  redirect: vi.fn(),
}))

const { default: Download } = await import("../page")

describe("DownloadPageClient checksum", () => {
  beforeEach(() => {
    checksumRef.current = null
  })

  it("does not render the checksum block without a checksum param", () => {
    render(<Download />)
    expect(screen.queryByTestId("download-checksum")).toBeNull()
  })

  it("renders a valid SHA-256 checksum in lowercase", () => {
    checksumRef.current = VALID_CHECKSUM
    render(<Download />)
    const block = screen.getByTestId("download-checksum")
    expect(block.textContent).toContain(VALID_CHECKSUM.toLowerCase())
  })

  it.each([
    ["too short", "abc123"],
    ["non-hex characters", "z".repeat(64)],
    ["markup injection", `<script>alert(1)</script>${"a".repeat(40)}`],
    ["too long", "a".repeat(65)],
  ])("ignores an invalid checksum (%s)", (_label, value) => {
    checksumRef.current = value
    render(<Download />)
    expect(screen.queryByTestId("download-checksum")).toBeNull()
  })

  it("copies the checksum to the clipboard", async () => {
    checksumRef.current = VALID_CHECKSUM
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    })
    render(<Download />)
    const button = screen.getByTestId("copy-checksum-button")
    const iconBefore = button.innerHTML
    fireEvent.click(button)
    expect(writeText).toHaveBeenCalledWith(VALID_CHECKSUM.toLowerCase())
    // The clipboard icon is swapped for a check mark once copied.
    await waitFor(() => expect(button.innerHTML).not.toBe(iconBefore))
  })
})
