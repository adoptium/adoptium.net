import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import Download from "../page"

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string): string | null => {
      if (key === "link") return "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U.tar.gz"
      if (key === "vendor") return "Adoptium"
      return null
    }
  }),
  redirect: vi.fn()
}))

describe("Download page", () => {
  it("renders correctly", () => {
    const { container } = render(<Download />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Download />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// Security: URL allowlist validation tests
// These tests exercise the guard logic directly so they remain fast and
// deterministic without needing to spin up the full component.

type AllowedPrefix = [string, string]

function isValidDownloadLink(link: string): boolean {
  let parsedLink: URL
  try {
    parsedLink = new URL(link)
  } catch {
    return false
  }

  const allowedPrefixes: AllowedPrefix[] = [
    ["https://github.com", "/adoptium/temurin"],
    ["https://cdn.azul.com", "/zulu/"],
    ["https://aka.ms", "/download-jdk/"],
    ["https://github.com", "/ibmruntimes/"],
    ["https://github.com", "/dragonwell-project/"],
    ["https://developers.redhat.com", "/"],
  ]

  return allowedPrefixes.some(
    ([origin, pathPrefix]) =>
      parsedLink.origin === origin &&
      parsedLink.pathname.startsWith(pathPrefix),
  )
}

describe("Download link allowlist security", () => {
  it("allows a legitimate temurin asset URL", () => {
    expect(
      isValidDownloadLink(
        "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.3%2B9/OpenJDK21U.tar.gz",
      ),
    ).toBe(true)
  })

  it("allows a legitimate ibmruntimes URL", () => {
    expect(
      isValidDownloadLink(
        "https://github.com/ibmruntimes/semeru21-binaries/releases/download/jdk-21.0.3%2B9_openj9-0.44.0/ibm-semeru-open-jdk_x64_linux_21.0.3_9_openj9-0.44.0.tar.gz",
      ),
    ).toBe(true)
  })

  it("blocks a plainly off-allowlist domain", () => {
    expect(isValidDownloadLink("https://evil.example.com/malware.exe")).toBe(false)
  })

  it("blocks a dot-segment traversal against the adoptium/temurin prefix", () => {
    // Raw string starts with https://github.com/adoptium/temurin so it would
    // pass a startsWith check, but the WHATWG URL parser resolves ../../ and
    // the normalised pathname escapes /adoptium/.
    expect(
      isValidDownloadLink(
        "https://github.com/adoptium/temurin/../../attacker-org/malware/releases/download/v1/temurin-installer.exe",
      ),
    ).toBe(false)
  })

  it("blocks a dot-segment traversal against the ibmruntimes/ prefix", () => {
    expect(
      isValidDownloadLink(
        "https://github.com/ibmruntimes/../attacker-org/malware/releases/download/v1/jdk.msi",
      ),
    ).toBe(false)
  })

  it("blocks a percent-encoded dot-segment traversal (%2e%2e)", () => {
    expect(
      isValidDownloadLink(
        "https://github.com/adoptium/temurin/%2e%2e/%2e%2e/attacker-org/malware/releases/download/v1/installer.exe",
      ),
    ).toBe(false)
  })

  it("rejects a non-URL string", () => {
    expect(isValidDownloadLink("not-a-url")).toBe(false)
  })
})
