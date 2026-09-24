/**
 * Component-level tests for the redirect paths in DownloadPageClient.
 * These live in a separate file so they can use their own vi.mock() factory
 * without conflicting with the hoisted mock in page.test.tsx.
 */
import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"

const redirectMock = vi.fn()

// Factory returns a fresh useSearchParams stub whose `get` behaviour is
// controlled by `linkValue` — updated before each test via mockReturnValue.
const linkValueRef = { current: "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U.tar.gz" }

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string): string | null => {
      if (key === "link") return linkValueRef.current
      if (key === "vendor") return "Adoptium"
      return null
    },
  }),
  redirect: redirectMock,
}))

// Re-import after mock is set up
const { default: Download } = await import("../page")

describe("DownloadPageClient redirect paths", () => {
  beforeEach(() => {
    redirectMock.mockClear()
    // Reset to a valid URL so tests start from a known state.
    linkValueRef.current = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U.tar.gz"
  })

  it("redirects to /temurin/releases when link is an unparseable string", () => {
    linkValueRef.current = "not-a-url"
    expect(() => render(<Download />)).not.toThrow()
    expect(redirectMock).toHaveBeenCalledWith("/temurin/releases")
  })

  it("redirects to /temurin/releases when link is off the allowlist", () => {
    linkValueRef.current = "https://evil.example.com/malware.exe"
    expect(() => render(<Download />)).not.toThrow()
    expect(redirectMock).toHaveBeenCalledWith("/temurin/releases")
  })
})
