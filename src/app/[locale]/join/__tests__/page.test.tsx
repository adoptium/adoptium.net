import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import Join from "../page"

describe("Join page", () => {
  it("renders correctly", () => {
    const { container } = render(<Join />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Join />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
