import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AQAvit from "../index"

describe("AQAvit component", () => {
  it("should render correctly", () => {
    const { container } = render(<AQAvit />)

    expect(container).toMatchSnapshot()
  })
})
