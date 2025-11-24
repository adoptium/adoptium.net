import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import Banner from "../index";

describe("Banner", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default date for all tests -> 21/12/2012 - This is the end of the world!
    // NOTE: this is important for accessibility tests
    const date = Date.UTC(2012, 11, 21, 0, 0, 0, 0);
    vi.useFakeTimers({now: date, shouldAdvanceTime: true});
  });

  afterEach(() => {
    cleanup();

    vi.useRealTimers();
  });

  it("renders the banner with heading", () => {
    render(<Banner />);
    expect(screen.getByLabelText(/Dismiss banner/i)).toBeInTheDocument();
  });

});
