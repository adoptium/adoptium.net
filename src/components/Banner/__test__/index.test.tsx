import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import Banner from "../index";

vi.useFakeTimers();

describe("Banner", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the banner with heading", () => {
    render(<Banner />);
    expect(screen.getByText(/Read the Case Study/i)).toBeInTheDocument();
  });

});
