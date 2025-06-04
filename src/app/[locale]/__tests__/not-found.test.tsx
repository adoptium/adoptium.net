import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import NotFound from "../not-found"

describe("NotFound page", () => {
  it("renders correctly", () => {
    const { container } = render(<NotFound />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<NotFound />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})