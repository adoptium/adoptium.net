import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import BannerMiddle from "../index";

vi.useFakeTimers();

describe("BannerMiddle", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.useFakeTimers();

    // Default date for all tests -> 21/12/2012 - This is the end of the world!
    // NOTE: this is important for accessibility tests
    const date = Date.UTC(2012, 11, 21, 0, 0, 0, 0);
    vi.setSystemTime(date);
  });

  afterEach(() => {
    cleanup();

    vi.useRealTimers();
  });

  it("renders the banner with heading", () => {
    render(<BannerMiddle />);
    expect(screen.getByText(/become a sustainer!/i)).toBeInTheDocument();
  });

});
