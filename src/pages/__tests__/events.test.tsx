import React from "react"
import { render, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import Events, { Head } from "../events"
import * as hooks from "../../hooks"

vi.mock("../../components/Timeline", () => ({
  default: () => <div data-testid="timeline">Mock Timeline</div>,
}))

describe("Events page", () => {
  it("renders correctly", async () => {
    vi.spyOn(hooks, "fetchLatestEvents").mockResolvedValue([
      {
        title: "Mock Event",
        description: "This is a mock event.",
        date: new Date().toISOString(),
        infoLink: "https://example.com/event",
      },
    ])

    const { container, getByText, getByTestId } = render(<Events />)

    await waitFor(() => {
      expect(getByTestId("timeline")).toBeTruthy()
      expect(getByText("Upcoming Events")).toBeTruthy()
    })

    const pageContent = container.querySelector("main")
    expect(pageContent).toMatchSnapshot()
  })

  it("head renders correctly", () => {
    const { container } = render(<Head />)
    const title = container.querySelector("title")
    expect(title?.textContent).toContain("Events")
  })

  it("has no accessibility violations", async () => {
    vi.spyOn(hooks, "fetchLatestEvents").mockResolvedValue([])

    const { container } = render(<Events />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
