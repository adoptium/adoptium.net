import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import BannerMiddle from "../index";

vi.useFakeTimers();

describe("BannerMiddle", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the banner with heading", () => {
    render(<BannerMiddle />);
    expect(screen.getByText(/become a sustainer!/i)).toBeInTheDocument();
  });

});
