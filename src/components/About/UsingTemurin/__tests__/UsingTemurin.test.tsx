import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import UsingTemurin from "../index"

describe("UsingTemurin component", () => {
  it("should render correctly", () => {
    const { container } = render(<UsingTemurin />)

    expect(container).toMatchSnapshot()
  })
})
