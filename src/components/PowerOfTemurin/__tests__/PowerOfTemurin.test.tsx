import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import PowerOfTemurin from ".."

vi.mock("../../../UiVirtualScroll", () => {
  return {
    default: () => <div>UiVirtualScroll</div>,
  }
})

describe("PowerOfTemurin component", () => {
  it("should render correctly", () => {
    const { container } = render(<PowerOfTemurin />)

    expect(container).toMatchSnapshot()
  })
})
