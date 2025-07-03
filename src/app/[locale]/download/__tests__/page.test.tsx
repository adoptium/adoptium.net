import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"
import Download from "../page"

interface MockSearchParams {
  get: (key: string) => string | null
}

interface MockNavigation {
  useSearchParams: () => MockSearchParams
}

vi.mock("next/navigation", () => ({
  useSearchParams: (): MockSearchParams => ({
    get: (key: string): string | null => {
      if (key === "link") return "https://github.com/adoptium/temurin-1-binaries/download"
      if (key === "vendor") return "Adoptium"
      return null
    }
  })
}) as MockNavigation)

describe("Download page", () => {
  it("renders correctly", () => {
    const { container } = render(<Download />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Download />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
