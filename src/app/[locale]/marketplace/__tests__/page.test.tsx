import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import Marketplace from "../page"

describe("Marketplace page", () => {
  it("renders correctly", () => {
    const { container } = render(<Marketplace />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Marketplace />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
