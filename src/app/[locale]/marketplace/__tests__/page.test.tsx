import React from "react"
import { render, cleanup } from "@testing-library/react"
import { describe, expect, it, afterEach, vi } from "vitest"
import { axe } from "vitest-axe"
import Marketplace from "../page"

// Add afterEach cleanup to clear timers and unmount components
afterEach(() => {
  cleanup();
  // Clear all timers to avoid lingering async work
  vi.clearAllTimers();
})

describe("Marketplace page", () => {
  it("renders correctly", () => {
    const { container } = render(<Marketplace />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Marketplace />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
