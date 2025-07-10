import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import HomePage from "../HomePageClient"

// Mock the LatestNews component with a synchronous version
vi.mock("@/components/News/LatestNews", () => {
  return {
    default: () => <div data-testid="mocked-latest-news">Latest News Content</div>
  }
})

describe("Index page", () => {
  it("renders correctly", () => {
    const { container } = render(<HomePage latestLTS={21} total_downloads={1000000000} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<HomePage latestLTS={21} total_downloads={1000000000} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})