import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import TemurinNightly from "../page"

describe("TemurinNightly page", () => {
  it("renders correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-13T12:00:00Z"));
    const { container } = render(<TemurinNightly />)
    expect(container.firstChild).toMatchSnapshot()
    vi.useRealTimers();
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TemurinNightly />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
