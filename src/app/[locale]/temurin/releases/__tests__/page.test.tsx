import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import TemurinReleases from "../releases-client"

// mock { useSearchParams } from "next/navigation"
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "version") return "17"
      return null
    },
    entries: () =>
      [
        ["version", "17"]
      ][Symbol.iterator]()
  })
}))

const availableReleases = {
  available_lts_releases: [8, 11, 17, 21],
  most_recent_lts: 21,
  available_releases: [8, 11, 17, 18, 21, 23, 24],
}

describe("TemurinReleases page", () => {
  it("renders correctly", () => {
    const { container } = render(<TemurinReleases availableReleases={availableReleases} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TemurinReleases availableReleases={availableReleases} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
