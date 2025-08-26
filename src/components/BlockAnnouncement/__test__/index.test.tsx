import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import BlockAnnouncement from "../index";

vi.useFakeTimers();

describe("BlockAnnouncement", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the banner with heading", () => {
    render(<BlockAnnouncement />);
    expect(screen.getByText(/become a sustainer!/i)).toBeInTheDocument();
  });

});
