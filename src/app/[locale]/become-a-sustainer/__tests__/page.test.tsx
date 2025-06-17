import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import BecomeASustainer from "../page"

describe("BecomeASustainer page", () => {
  it("renders correctly", () => {
    const { container } = render(<BecomeASustainer />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<BecomeASustainer />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
