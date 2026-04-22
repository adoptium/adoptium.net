import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AccordionItem from "..";

// Using similar structure to the AsciiDocFormatter tests
describe("AccordionItem", () => {
  it("renders with the correct title", () => {
    render(<AccordionItem title="Test Title">Content</AccordionItem>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders with the content initially hidden", () => {
    render(
      <AccordionItem title="Test Title">
        <p>Hidden Content</p>
      </AccordionItem>,
    );

    // The content should be in the DOM but visually hidden via max-h-0
    const content = screen.getByText("Hidden Content");
    const contentContainer = content.closest(
      "div[id^='accordion-collapse-body']",
    );
    expect(contentContainer).toHaveClass("max-h-0");
    expect(contentContainer).toHaveClass("overflow-hidden");
  });

  it("shows content when clicked", () => {
    render(
      <AccordionItem title="Click Me">
        <p>Toggle Content</p>
      </AccordionItem>,
    );

    // Content should be hidden initially
    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();

    // Find the container by the accordionId that should have max-h-0
    const contentBeforeClick = screen
      .getByText("Toggle Content")
      .closest("div[id^='accordion-collapse-body']");
    expect(contentBeforeClick).toHaveClass("max-h-0");

    // Click the button
    fireEvent.click(button);

    // Content should now be visible (max-h-[2000px] instead of max-h-0)
    const contentAfterClick = screen
      .getByText("Toggle Content")
      .closest("div[id^='accordion-collapse-body']");
    expect(contentAfterClick).not.toHaveClass("max-h-0");
  });

  it("toggles between open and closed states", () => {
    render(
      <AccordionItem title="Toggle Me">
        <p>Content to toggle</p>
      </AccordionItem>,
    );

    const button = screen.getByRole("button", { name: "Toggle Me" });

    // Initially closed - aria-expanded should be false
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Click to open
    fireEvent.click(button);

    // Should now be open - aria-expanded should be true
    expect(button).toHaveAttribute("aria-expanded", "true");

    // Click again to close
    fireEvent.click(button);

    // Should now be closed again - aria-expanded should be false
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("renders ReactNode title correctly", () => {
    const titleNode = (
      <span data-testid="custom-title">
        Complex <strong>Title</strong>
      </span>
    );

    render(<AccordionItem title={titleNode}>Content</AccordionItem>);

    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });
});
