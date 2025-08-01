import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import AsciiDocFormatter from ".."

// Mock next-intl's useTranslations hook
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "table-of-contents": "Table of Contents"
    };
    return translations[key] || key;
  }
}));

// Mock AccordionItem component
vi.mock("@/components/Asciidoc/AccordionItem", () => ({
  __esModule: true,
  default: ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => (
    <div data-testid="mock-accordion">
      <div data-testid="accordion-title">{title}</div>
      <div data-testid="accordion-content">{children}</div>
    </div>
  ),
}))

describe("AsciiDocFormatter", () => {
  it("renders basic HTML content correctly", () => {
    const { container } = render(<AsciiDocFormatter content="<p>Hello world</p>" />)
    expect(screen.getByText("Hello world")).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it("transforms internal links correctly", () => {
    const content = '<p><a href="/internal-link">Internal Link</a></p>'
    render(<AsciiDocFormatter content={content} />)

    const link = screen.getByText("Internal Link")
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("href", "/internal-link")
    expect(link).not.toHaveAttribute("target")
    expect(link).not.toHaveAttribute("rel")
  })

  it("transforms external links correctly with external icon", () => {
    // Mock window.location.host
    Object.defineProperty(window, "location", {
      value: { host: "adoptium.net" },
      writable: true
    })

    const content = '<p><a href="https://example.com">External Link</a></p>'
    const { container } = render(<AsciiDocFormatter content={content} />)

    const link = screen.getByText("External Link")
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")

    // Check for the external link icon
    const icon = container.querySelector(".fa-external-link")
    expect(icon).toBeInTheDocument()
  })

  it("transforms FontAwesome Docker icon correctly", () => {
    const content = '<p><i class="fa fa-docker"></i></p>'
    const { container } = render(<AsciiDocFormatter content={content} />)

    const icon = container.querySelector(".fab.fa-docker")
    expect(icon).toBeInTheDocument()
  })

  it("transforms table of contents correctly", () => {
    const content = `
      <div class="toc">
        <ul class="sectlevel1">
          <li><a href="#section1">Section 1</a></li>
          <li><a href="#section2">Section 2</a></li>
        </ul>
      </div>
    `
    render(<AsciiDocFormatter content={content} />)

    // Check for Table of Contents text
    expect(screen.getByText("Table of Contents")).toBeInTheDocument()

    // Check for section links
    expect(screen.getByText("Section 1")).toBeInTheDocument()
    expect(screen.getByText("Section 2")).toBeInTheDocument()
  })

  it("transforms iframe tags correctly", () => {
    const content = '<iframe src="https://example.com/embed" title="Sample Embed"></iframe>'
    const { container } = render(<AsciiDocFormatter content={content} />)

    const iframe = container.querySelector("iframe")
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute("src", "https://example.com/embed")
    expect(iframe).toHaveAttribute("title", "Sample Embed")
    expect(iframe).toHaveClass("w-full")
    expect(iframe).toHaveClass("aspect-video")
  })

  it("transforms details/summary into AccordionItem", () => {
    const content = `
      <details>
        <summary>Accordion Title</summary>
        <p>Accordion Content</p>
      </details>
    `
    render(<AsciiDocFormatter content={content} />)

    // Check that the AccordionItem mock is used
    expect(screen.getByTestId("mock-accordion")).toBeInTheDocument()

    // Check that the title and content are passed correctly
    const title = screen.getByTestId("accordion-title")
    expect(title).toHaveTextContent("Accordion Title")

    const content_ = screen.getByTestId("accordion-content")
    expect(content_).toHaveTextContent("Accordion Content")
  })

  it("transforms icon td cells correctly", () => {
    const content = '<table><tbody><tr><td class="icon"></td></tr></tbody></table>'
    const { container } = render(<AsciiDocFormatter content={content} />)

    const icon = container.querySelector(".fa-circle-info")
    expect(icon).toBeInTheDocument()
  })

  it("transforms heading tags with hoverable anchors correctly", () => {
    const content = `
      <h1 id="heading-1">Main Title</h1>
      <h2 id="heading-2">Subtitle</h2>
      <h3>Title without ID</h3>
    `
    const { container } = render(<AsciiDocFormatter content={content} />)

    // Check that headings are rendered with proper classes
    const h1 = screen.getByRole("heading", { level: 1 })
    expect(h1).toHaveAttribute("id", "heading-1")
    expect(h1).toHaveClass("group", "relative", "scroll-mt-30")
    expect(h1).toHaveTextContent("Main Title")

    const h2 = screen.getByRole("heading", { level: 2 })
    expect(h2).toHaveAttribute("id", "heading-2")
    expect(h2).toHaveClass("group", "relative", "scroll-mt-30")
    expect(h2).toHaveTextContent("Subtitle")

    // Check that anchor links are present for headings with IDs
    const h1Anchor = container.querySelector('a[href="#heading-1"]')
    expect(h1Anchor).toBeInTheDocument()
    expect(h1Anchor).toHaveAttribute("aria-label", "Link to h1 section")
    expect(h1Anchor).toHaveClass("absolute", "-left-6", "top-0", "opacity-0", "group-hover:opacity-100")

    const h2Anchor = container.querySelector('a[href="#heading-2"]')
    expect(h2Anchor).toBeInTheDocument()
    expect(h2Anchor).toHaveAttribute("aria-label", "Link to h2 section")

    // Check that anchor icons are present
    const linkIcons = container.querySelectorAll(".fa-link")
    expect(linkIcons).toHaveLength(2) // Only h1 and h2 should have anchors (h3 has no ID)

    // Check that heading without ID doesn't have an anchor
    const h3 = screen.getByRole("heading", { level: 3 })
    expect(h3).toHaveClass("group", "relative", "scroll-mt-30")
    expect(h3).toHaveTextContent("Title without ID")
    const h3Parent = h3.parentElement
    const h3Anchor = h3Parent?.querySelector('a[href="#"]')
    expect(h3Anchor).not.toBeInTheDocument()
  })
})
