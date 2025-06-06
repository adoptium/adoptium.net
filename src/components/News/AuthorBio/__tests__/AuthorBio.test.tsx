import React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AuthorBio from "../index"

describe("AuthorBio component", () => {
  it("should render correctly", () => {
    const { container } = render(
      <AuthorBio author={
        {
          name: "Test Author",
          summary: "Test Summary",
          github: "adoptium",
          twitter: "adoptium",
          linkedin: "adoptium",
        }
      }
      identifier="pmc"
      />,
    )

    expect(container).toMatchSnapshot()
  })

  it("should render correctly - Summary", () => {
    render(
      <AuthorBio
        author={{
          name: "Test Author",
          summary: "Test Summary",
          github: "adoptium",
          twitter: "adoptium",
          linkedin: "adoptium",
        }}
        identifier="pmc"
      />,
    )
  })

  it("should render correctly - no GitHub", () => {
    render(
      <AuthorBio
        author={{
          name: "Test Author",
            twitter: "adoptium",
            linkedin: "adoptium",
        }}
        identifier="pmc"
      />,
    )
  })

  it("should render correctly - no Linked", () => {
    render(
      <AuthorBio
        author={{
          name: "Test Author",
          summary: "Test Summary",
          github: "adoptium",
          twitter: "adoptium",
        }}
        identifier="pmc"
      />,
    )
  })

  it("should render correctly - no Twitter", () => {
    render(
      <AuthorBio
        author={{
          name: "Test Author",
          summary: "Test Summary",
          github: "adoptium",
          twitter: "adoptium",
        }}
        identifier="pmc"
      />,
    )
  })
})
