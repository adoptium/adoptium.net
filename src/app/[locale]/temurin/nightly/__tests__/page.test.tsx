import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import TemurinNightly from "../page"

describe("TemurinNightly page", () => {
  it("renders correctly", () => {
    const { container } = render(<TemurinNightly />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<TemurinNightly />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
