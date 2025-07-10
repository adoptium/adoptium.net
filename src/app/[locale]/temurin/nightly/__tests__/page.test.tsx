import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import TemurinNightly from "../TemurinNightlyPageClient"

const allVersions = [
  { value: "8", name: "8 - LTS" },
  { value: "11", name: "11 - LTS" },
  { value: "17", name: "17 - LTS" },
  { value: "21", name: "21 - LTS" },
  { value: "23", name: "23" },
  { value: "24", name: "24" },
]

describe("TemurinNightly page", () => {
  it("renders correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-13T12:00:00Z"));
    const { container } = render(<TemurinNightly allVersions={allVersions} latestLTS={21} />)
    expect(container.firstChild).toMatchSnapshot()
    vi.useRealTimers();
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TemurinNightly allVersions={allVersions} latestLTS={21} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
