import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Pagination from "../";

describe("Pagination component", () => {
  it("renders correctly when totalPages <= 7", () => {
    render(
      <Pagination
        previousPageNumber={2}
        previousPageLink="/test/page/2"
        nextPage="/test/page/4"
        currentPage={3}
        totalPages={5}
        baseUrl="/test"
      />
    );

    // Expect pages 1 through 5 to be rendered with no ellipsis.
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
    expect(screen.queryByText("...")).toBeNull();

    // Check that both "Previous" and "Next" buttons are rendered.
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders correctly for currentPage=1 when totalPages > 7", () => {
    render(
      <Pagination
        previousPageNumber={null}
        previousPageLink={null}
        nextPage="/test/page/2"
        currentPage={1}
        totalPages={8}
        baseUrl="/test"
      />
    );

    // Expected pages for page 1: 1, 2, 3, 4, 5, ... , 8
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();

    // There should be one ellipsis.
    expect(screen.getAllByText("...")).toHaveLength(1);

    // "Previous" button should not render when previousPageNumber is null.
    expect(screen.queryByText("Previous")).toBeNull();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders correctly for a middle page when totalPages > 7", () => {
    render(
      <Pagination
        previousPageNumber={4}
        previousPageLink="/test/page/4"
        nextPage="/test/page/6"
        currentPage={5}
        totalPages={10}
        baseUrl="/test"
      />
    );

    // Expected pages for currentPage 5: 1, ... , 3, 4, 5, 6, 7, ... , 10
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    // There should be two ellipses.
    expect(screen.getAllByText("...")).toHaveLength(2);

    // Both arrow links should be rendered.
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders correctly for a near-end page", () => {
    render(
      <Pagination
        previousPageNumber={6}
        previousPageLink="/test/page/6"
        nextPage="/test/page/8"
        currentPage={7}
        totalPages={8}
        baseUrl="/test"
      />
    );

    // Expected pages for currentPage 7: 1, ... , 4, 5, 6, 7, 8
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();

    // There should be one ellipsis.
    expect(screen.getAllByText("...")).toHaveLength(1);

    // Both arrow links should be rendered.
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
