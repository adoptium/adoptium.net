import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import MembershipLevels from "../index";

// Mock CommonButton component
vi.mock("@/components/Common/CommonButton", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

describe("MembershipLevels", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with default props", () => {
    render(<MembershipLevels />);

    expect(screen.getByText("Membership Levels")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Choose the membership level that best fits your organization's needs and engagement with the Adoptium community."
      )
    ).toBeInTheDocument();
  });

  it("renders with custom title and description", () => {
    const customTitle = "Custom Membership Title";
    const customDescription = "Custom description for membership levels";

    render(
      <MembershipLevels title={customTitle} description={customDescription} />
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it("renders all three membership tiers", () => {
    render(<MembershipLevels />);

    // Check for tier titles
    expect(screen.getByText("Strategic")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Participant")).toBeInTheDocument();

    // Check for subtitles (all should be "Member")
    const memberSubtitles = screen.getAllByText("Member");
    expect(memberSubtitles).toHaveLength(3);
  });

  it("displays correct pricing for each tier", () => {
    render(<MembershipLevels />);

    expect(screen.getByText("$10,000 - $50,000")).toBeInTheDocument();
    expect(screen.getByText("$12,000 - $32,000")).toBeInTheDocument();
    expect(screen.getByText("$0 - $15,000")).toBeInTheDocument();

    // Check pricing notes
    const pricingNotes = screen.getAllByText("(Based on corporate revenue)");
    expect(pricingNotes).toHaveLength(3);
  });

  it("displays benefits for Strategic membership", () => {
    render(<MembershipLevels />);

    expect(
      screen.getByText(
        "For organisations that view Adoptium as critical to their future and are looking to play a leading role in shaping its direction."
      )
    ).toBeInTheDocument();
  });

  it("displays benefits for Enterprise membership", () => {
    render(<MembershipLevels />);

    expect(
      screen.getByText(
        "For organisations that rely on Adoptium in their business operations and are seeking to influence the ecosystem's direction."
      )
    ).toBeInTheDocument();
  });

  it("displays benefits for Participant membership", () => {
    render(<MembershipLevels />);

    expect(
      screen.getByText(
        "For organisations that use or build on Adoptium technology and are looking to stay engaged as it evolves."
      )
    ).toBeInTheDocument();
  });

  it("applies featured styling to Strategic tier", () => {
    const { container } = render(<MembershipLevels />);

    // Strategic tier should have featured border styling
    const strategicCard = container.querySelector(".border-rose-600");
    expect(strategicCard).toBeInTheDocument();
  });

  it("renders checkmark icons for benefits", () => {
    const { container } = render(<MembershipLevels />);

    // Check for SVG checkmark icons by querying the DOM directly
    const checkmarkIcons = container.querySelectorAll("svg");
    expect(checkmarkIcons.length).toBeGreaterThan(0);

    // Verify the checkmarks are within the benefit sections
    const benefitSections = container.querySelectorAll(".space-y-4");
    expect(benefitSections.length).toBe(3); // One for each tier
  });

  it("renders bottom CTA section", () => {
    render(<MembershipLevels />);

    expect(
      screen.getByText(
        "Questions about membership levels? We're here to help you choose the right tier."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("renders Learn More button with correct link", () => {
    render(<MembershipLevels />);

    const learnMoreLink = screen.getByRole("link");
    expect(learnMoreLink).toHaveAttribute(
      "href",
      "https://www.eclipse.org/org/workinggroups/adoptium-charter.php"
    );
  });

  it("has proper accessibility structure", () => {
    const { container } = render(<MembershipLevels />);

    // Should have 1 h2 (main title) and 3 h3 (tier titles)
    const h2Headings = container.querySelectorAll("h2");
    const h3Headings = container.querySelectorAll("h3");

    expect(h2Headings).toHaveLength(1);
    expect(h3Headings).toHaveLength(3);

    expect(h2Headings[0]).toHaveTextContent("Membership Levels");
    expect(h3Headings[0]).toHaveTextContent("Strategic");
    expect(h3Headings[1]).toHaveTextContent("Enterprise");
    expect(h3Headings[2]).toHaveTextContent("Participant");
  });

  it("applies correct CSS classes for responsive layout", () => {
    const { container } = render(<MembershipLevels />);

    // Check for responsive grid classes
    const gridContainer = container.querySelector(
      ".grid-cols-1.md\\:grid-cols-3"
    );
    expect(gridContainer).toBeInTheDocument();

    // Check for responsive text classes
    const title = container.querySelector(".text-4xl.md\\:text-5xl");
    expect(title).toBeInTheDocument();
  });

  it("renders with proper color scheme", () => {
    const { container } = render(<MembershipLevels />);

    // Check for rose color scheme elements
    const roseBorder = container.querySelector(".border-rose-600");
    expect(roseBorder).toBeInTheDocument();

    const roseText = container.querySelector(".text-rose-600");
    expect(roseText).toBeInTheDocument();

    const roseGradient = container.querySelector(".from-rose-500.to-rose-600");
    expect(roseGradient).toBeInTheDocument();
  });
});
