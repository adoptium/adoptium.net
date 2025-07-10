import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import Docs from "../page"

describe("Docs page", () => {
  it("renders correctly", () => {
    const { container } = render(<Docs />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Docs />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})