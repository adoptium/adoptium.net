import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import SupportUs from "../page"

vi.mock("@/components/Logos", () => {
  return {
    __esModule: true,
    default: () => <div />,
    LogoType: {},
  }
})

describe("Support Us page", () => {
  it("renders correctly", () => {
    const { container } = render(<SupportUs />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<SupportUs />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
