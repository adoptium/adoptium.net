import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import SupportedPlatforms from "../page"

describe("Supported Platforms page", () => {
  it("renders correctly", () => {
    const { container } = render(<SupportedPlatforms />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<SupportedPlatforms />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
