import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import Events from "../page"

describe("Events page", () => {
  it("renders correctly", () => {
    const { container } = render(<Events />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Events />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
