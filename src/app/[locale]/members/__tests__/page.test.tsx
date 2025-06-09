import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import Members from "../page"

vi.mock("@/components/Logos", () => {
  return {
    __esModule: true,
    default: () => <div />,
    LogoType: {},
  }
})

describe("Members page", () => {
  it("renders correctly", () => {
    const { container } = render(<Members />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Members />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
