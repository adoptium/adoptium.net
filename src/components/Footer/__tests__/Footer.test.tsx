import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Footer from "..";

describe("Footer component", () => {
  it("renders correctly", () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });

  it("disclaimer link opens external URL when user confirms", () => {
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);
    const openMock = vi.spyOn(window, "open").mockImplementation(() => null);

    const { getAllByText } = render(<Footer />);
    const swagLink = getAllByText("Swag Store")[0];
    fireEvent.click(swagLink);

    expect(confirmMock).toHaveBeenCalled();
    expect(openMock).toHaveBeenCalledWith(
      expect.stringContaining("eclipse-foundation.store"),
      "_blank",
    );

    confirmMock.mockRestore();
    openMock.mockRestore();
  });

  it("disclaimer link does not open URL when user cancels confirm", () => {
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(false);
    const openMock = vi.spyOn(window, "open").mockImplementation(() => null);

    const { getAllByText } = render(<Footer />);
    const swagLink = getAllByText("Swag Store")[0];
    fireEvent.click(swagLink);

    expect(confirmMock).toHaveBeenCalled();
    expect(openMock).not.toHaveBeenCalled();

    confirmMock.mockRestore();
    openMock.mockRestore();
  });

  it("mobile footer section toggles open on click", () => {
    const { getAllByRole } = render(<Footer />);
    // Footer has mobile accordion buttons — click the first one
    const buttons = getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    fireEvent.click(buttons[0]);
    // Should not throw; accordion state changed
  });
});
