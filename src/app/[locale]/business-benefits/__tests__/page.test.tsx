import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import BusinessBenefits from "../page"

vi.mock("@/components/Logos", () => {
  return {
    __esModule: true,
    default: () => <div />,
    LogoType: {},
  }
})

describe("Business Benefits page", () => {
  it("renders correctly", () => {
    const { container } = render(<BusinessBenefits />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<BusinessBenefits />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
