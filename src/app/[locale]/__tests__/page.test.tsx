import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import Index from "../page"

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