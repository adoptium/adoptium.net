import React from "react"
import { render, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import TimeLine from "../"

const mockData = [
    {
        title: "Event A",
        description: "This is a description for Event A.",
        date: new Date().toISOString(), // today
        infoLink: "https://example.com/a",
    },
    {
        title: "Event B",
        description: "This is a description for Event B.",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
        infoLink: "https://example.com/b",
    },
]

describe("TimeLine component", () => {
    it("should render correctly with events", () => {
        const { container } = render(<TimeLine data={mockData} />)
        expect(container).toMatchSnapshot()
    })

    it("should render correctly with no events", () => {
        const { container } = render(<TimeLine data={[]} />)
        expect(container).toMatchSnapshot()
    })

    it("should filter out events with no date", () => {
        const dataWithInvalid = [
            ...mockData,
            {
                title: "Event C",
                description: "This is a description for Event C.",
                date: "", // invalid but type-safe
                infoLink: "https://example.com/c",
            },
        ]
        const { container, queryByText } = render(<TimeLine data={dataWithInvalid} />)
        // Only count headings in the timeline, not in pagination or elsewhere
        const headings = within(container).getAllByRole("heading", { name: /Event [AB]/ })
        expect(headings.filter(h => h.textContent === "Event A").length).toBe(1)
        expect(headings.filter(h => h.textContent === "Event B").length).toBe(1)
        expect(queryByText("Event C")).toBeNull()
    })
})
