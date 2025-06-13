import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import TemurinReleases from "../page"

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

describe("TemurinReleases page", () => {
  it("renders correctly", () => {
    const { container } = render(<TemurinReleases />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TemurinReleases />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
