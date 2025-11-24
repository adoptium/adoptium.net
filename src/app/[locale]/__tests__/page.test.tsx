import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach  } from "vitest"
import { axe } from "vitest-axe"
import HomePage from "../HomePageClient"

// Mock the LatestNews component with a synchronous version
vi.mock("@/components/News/LatestNews", () => {
  return {
    default: () => <div data-testid="mocked-latest-news">Latest News Content</div>
  }
})

describe("Index page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default date for all tests -> 21/12/2012 - This is the end of the world!
    // NOTE: this is important for accessibility tests
    const date = Date.UTC(2012, 11, 21, 0, 0, 0, 0);
    vi.useFakeTimers({now: date, shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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