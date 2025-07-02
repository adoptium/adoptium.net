import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import TemurinPage from "../TemurinPageClient"

// Mock the LatestNews component with a synchronous version
vi.mock("@/components/News/LatestNews", () => {
  return {
    default: () => <div data-testid="mocked-latest-news">Latest News Content</div>
  }
})

describe("TemurinIndex page", () => {
  it("renders correctly", () => {
    const { container } = render(<TemurinPage latestLTS={21} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TemurinPage latestLTS={21} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
