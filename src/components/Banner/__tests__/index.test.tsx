import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest";
import Banner from "../index"

describe("Banner", () => {

    it("matches snapshot", () => {
        const { container } = render(<Banner />)
        expect(container).toMatchSnapshot()
    })
})
