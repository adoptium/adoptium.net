import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { FaDownload } from "react-icons/fa"
import DocumentationCard from ".."

describe("DocumentationCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <DocumentationCard
        title="Test Title"
        Icon={FaDownload}
        link="/test-link"
        links={[
          { name: "Link1", link: "/link1" },
          { name: "Link2", link: "https://external-link" },
        ]}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it("does not render without a title", () => {
    const { container } = render(
      <DocumentationCard
        title=""
        Icon={FaDownload}
        link="/test-link"
        links={[
          { name: "Link1", link: "/link1" },
          { name: "Link2", link: "https://external-link" },
        ]}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it("does not render without a Icon", () => {
    const { container } = render(
      <DocumentationCard
        title="Test Title"
        // @ts-expect-error Testing with invalid Icon prop
        Icon=""
        link="/test-link"
        links={[
          { name: "Link1", link: "/link1" },
          { name: "Link2", link: "https://external-link" },
        ]}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it("does not render when links is not object", () => {
    const { container } = render(
      <DocumentationCard
        title="Test Title"
        Icon={FaDownload}
        link="/test-link"
        // @ts-expect-error Testing with invalid links prop
        links="Bad Links"
      />,
    )
    expect(container).toMatchSnapshot()
  })
})
