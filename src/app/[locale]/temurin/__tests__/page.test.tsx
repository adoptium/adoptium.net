import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import TemurinIndex from "../page"

// Mock the LatestNews component with a synchronous version
vi.mock("@/components/News/LatestNews", () => {
  return {
    default: () => <div data-testid="mocked-latest-news">Latest News Content</div>
  }
})

describe("TemurinIndex page", () => {
  it("renders correctly", () => {
    const { container } = render(<TemurinIndex />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TemurinIndex />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
