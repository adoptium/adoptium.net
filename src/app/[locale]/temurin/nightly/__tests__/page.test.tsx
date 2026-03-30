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
  { value: "25", name: "25 - LTS" },
]

describe("TemurinNightly page", () => {
  it("renders correctly", () => {
    const date = new Date("2025-06-13T12:00:00Z");
    vi.useFakeTimers({now: date, shouldAdvanceTime: true});

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
