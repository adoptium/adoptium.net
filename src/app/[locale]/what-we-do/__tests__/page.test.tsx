import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import WhatWeDo from "../page"

describe("WhatWeDo page", () => {
  it("renders correctly", () => {
    const { container } = render(<WhatWeDo />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<WhatWeDo />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})