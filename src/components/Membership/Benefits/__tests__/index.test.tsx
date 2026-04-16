import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import MemberBenefitsTable from "../index";

describe("MemberBenefitsTable", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the table heading", () => {
    render(<MemberBenefitsTable />);
    expect(
      screen.getByRole("heading", { name: /compare membership levels/i }),
    ).toBeInTheDocument();
  });

  it("renders the core membership levels in the header", () => {
    render(<MemberBenefitsTable />);
    expect(screen.getByText("Benefit Category")).toBeInTheDocument();
    expect(screen.getByText("Strategic")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Participant")).toBeInTheDocument();
  });

  it("renders the accordion benefit categories", () => {
    render(<MemberBenefitsTable />);
    expect(screen.getByText("Governance")).toBeInTheDocument();
    expect(screen.getByText("Visibility")).toBeInTheDocument();
    expect(
      screen.getByText("Content & thought leadership"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Technical and infrastructure sharing"),
    ).toBeInTheDocument();
  });

  it("toggles accordion sections when clicked", () => {
    render(<MemberBenefitsTable />);

    // Governance section
    const governanceSection = screen.getByText("Governance");
    const firstBenefitBold = screen.getByText(
      "One guaranteed seat & one alternate representative",
    );

    // Next section
    const visibilitySection = screen.getByText("Visibility");
    const visibilityFirstBenefitBold = screen.getByText(
      "Logo placement on Adoptium website",
    );

    // Initially, the first index (Governance) is open by default
    expect(firstBenefitBold).toBeInTheDocument();

    // Click to close Governance
    fireEvent.click(governanceSection);

    // Click to open Visibility
    fireEvent.click(visibilitySection);
    expect(visibilityFirstBenefitBold).toBeInTheDocument();
  });
});
