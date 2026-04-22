import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import BannerMiddle from "../index";

vi.mock("../announcements", () => ({
  currentAnnouncements: [
    {
      title: "Fake Banner for Testing",
      description: "This is a fake banner used for testing purposes only.",
      cta: "Read the Case Study",
      ctaLink: "https://example.com",
      startDate: "2012-12-21T00:00:00Z",
      endDate: "2012-12-21T23:59:59Z",
    },
  ],
}));

describe("BannerMiddle", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default date for all tests -> 21/12/2012 - This is the end of the world!
    // NOTE: this is important for accessibility tests
    const date = Date.UTC(2012, 11, 21, 0, 0, 0, 0);
    vi.useFakeTimers({ now: date, shouldAdvanceTime: true });
  });

  afterEach(() => {
    cleanup();

    vi.useRealTimers();
  });

  it("renders the banner with heading", () => {
    render(<BannerMiddle />);
    expect(screen.getByText(/Fake Banner for Testing/i)).toBeInTheDocument();
  });
});
