import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import Slack from "../page"

describe("Slack page", () => {
  it("renders correctly", () => {
    const { container } = render(<Slack />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Slack />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
