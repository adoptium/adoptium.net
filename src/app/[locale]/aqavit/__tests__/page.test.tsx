import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import AQAvit from "../page"

describe("AQAvit page", () => {
  it("renders correctly", () => {
    const { container } = render(<AQAvit />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<AQAvit />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
