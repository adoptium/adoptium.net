import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import Index from "../page"

// Mock the useAdoptiumContributorsApi hook
vi.mock("@/hooks/useAdoptiumContributorsApi", () => ({
  useAdoptiumContributorsApi: () => null
}))

describe("Index page", () => {
  it("renders correctly", () => {
    const { container } = render(<Index />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Index />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})