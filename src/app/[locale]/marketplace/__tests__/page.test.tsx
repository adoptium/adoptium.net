import React from "react"
import { render, cleanup } from "@testing-library/react"
import { describe, expect, it, afterEach, vi } from "vitest"
import { axe } from "vitest-axe"
import Marketplace from "../MarketplacePageClient"

// Add afterEach cleanup to clear timers and unmount components
afterEach(() => {
  cleanup();
  // Clear all timers to avoid lingering async work
  vi.clearAllTimers();
})

const ltsVersions = [
  { name: "11", value: "11" },
  { name: "17", value: "17" },
  { name: "21", value: "21" },
]

describe("Marketplace page", () => {
  it("renders correctly", () => {
    const { container } = render(<Marketplace ltsVersions={ltsVersions} latestLTS={21} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Marketplace ltsVersions={ltsVersions} latestLTS={21} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
