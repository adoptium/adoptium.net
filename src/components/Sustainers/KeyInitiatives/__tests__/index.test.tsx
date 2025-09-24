import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import KeyInitiatives from "../index";

const mockInitiatives = [
  {
    header: "Lead the Future",
    image: "lead.svg",
    description: "Shape the roadmap of OpenJDK builds.",
  },
  {
    header: "Strengthen Strategy",
    image: "strengthen.svg",
    description: (
      <ul>
        <li>Join innovative ecosystem</li>
        <li>Benefit from stable licensing</li>
      </ul>
    ),
  },
  {
    header: "Reliable Governance",
    image: "governance.svg",
    description: "Trust in transparent governance.",
  },
  {
    header: "Join Leaders",
    image: "community.svg",
    description: "Collaborate with leading vendors.",
  },
];

describe("KeyInitiatives", () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = "";
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders with required props", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders optional description when provided", () => {
    const description = "This is a test description for the component.";

    render(
      <KeyInitiatives
        title="Test Title"
        description={description}
        initiatives={mockInitiatives}
      />
    );

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Should not find any description paragraph
    const descriptions = screen.queryAllByText(/this is a test description/i);
    expect(descriptions).toHaveLength(0);
  });

  it("renders all initiative cards", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Check that all initiative headers are rendered
    expect(screen.getByText("Lead the Future")).toBeInTheDocument();
    expect(screen.getByText("Strengthen Strategy")).toBeInTheDocument();
    expect(screen.getByText("Reliable Governance")).toBeInTheDocument();
    expect(screen.getByText("Join Leaders")).toBeInTheDocument();
  });

  it("renders images for each initiative", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Find images by their src attributes using document queries
    const images = document.querySelectorAll("img");
    expect(images).toHaveLength(4);

    expect(images[0]).toHaveAttribute("src", "/images/initiatives/lead.svg");
    expect(images[1]).toHaveAttribute(
      "src",
      "/images/initiatives/strengthen.svg"
    );
    expect(images[2]).toHaveAttribute(
      "src",
      "/images/initiatives/governance.svg"
    );
    expect(images[3]).toHaveAttribute(
      "src",
      "/images/initiatives/community.svg"
    );
  });

  it("handles string descriptions correctly", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    expect(
      screen.getByText("Shape the roadmap of OpenJDK builds.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Trust in transparent governance.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Collaborate with leading vendors.")
    ).toBeInTheDocument();
  });

  it("handles React node descriptions correctly", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Check for React node content
    expect(screen.getByText("Join innovative ecosystem")).toBeInTheDocument();
    expect(
      screen.getByText("Benefit from stable licensing")
    ).toBeInTheDocument();
  });

  it("applies correct CSS classes for responsive design", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Check grid container classes
    const gridContainer = screen.getByText("Lead the Future").closest(".grid");
    expect(gridContainer).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-3"
    );
  });

  it("creates unique IDs for each card container", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Check that card containers have unique IDs
    expect(document.getElementById("card-container-0")).toBeInTheDocument();
    expect(document.getElementById("card-container-1")).toBeInTheDocument();
    expect(document.getElementById("card-container-2")).toBeInTheDocument();
    expect(document.getElementById("card-container-3")).toBeInTheDocument();
  });

  it("creates hidden checkboxes for each card", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Check for hidden checkboxes
    expect(document.getElementById("toggle-0")).toBeInTheDocument();
    expect(document.getElementById("toggle-1")).toBeInTheDocument();
    expect(document.getElementById("toggle-2")).toBeInTheDocument();
    expect(document.getElementById("toggle-3")).toBeInTheDocument();

    // Verify they are hidden
    const checkbox = document.getElementById("toggle-0") as HTMLInputElement;
    expect(checkbox).toHaveClass("hidden");
  });

  it("handles empty initiatives array", () => {
    render(<KeyInitiatives title="Test Title" initiatives={[]} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    // Should not find any cards
    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);
  });

  it("handles mouse enter and leave events", async () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    const firstCard = document.getElementById("card-container-0");
    const firstCheckbox = document.getElementById(
      "toggle-0"
    ) as HTMLInputElement;

    expect(firstCard).toBeInTheDocument();
    expect(firstCheckbox).toBeInTheDocument();
    expect(firstCheckbox.checked).toBe(false);

    // Simulate mouse enter
    fireEvent.mouseEnter(firstCard!);
    await waitFor(() => {
      expect(firstCheckbox.checked).toBe(true);
    });

    // Simulate mouse leave
    fireEvent.mouseLeave(firstCard!);
    await waitFor(() => {
      expect(firstCheckbox.checked).toBe(false);
    });
  });

  it("applies different styles for cards at index 3 and above", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Card at index 3 should have the isNthValue styling
    const fourthCard = document.getElementById("card-container-3");
    // The main card div is the second child (after the checkbox input)
    const cardDiv = fourthCard?.children[2] as HTMLElement; // Skip input and span, get the main div

    expect(cardDiv).toHaveClass("lg:peer-checked:translate-y-[-236px]");
  });

  it("has proper accessibility attributes", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Check that images have aria-hidden since they're decorative
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("aria-hidden", "true");
      expect(img).toHaveAttribute("alt", "");
    });
  });

  it("renders with correct heading hierarchy", () => {
    render(<KeyInitiatives title="Test Title" initiatives={mockInitiatives} />);

    // Main title should be h2
    const mainTitle = screen.getByRole("heading", { level: 2 });
    expect(mainTitle).toHaveTextContent("Test Title");

    // Initiative headers should be h3
    const initiativeHeaders = screen.getAllByRole("heading", { level: 3 });
    expect(initiativeHeaders).toHaveLength(4);
    expect(initiativeHeaders[0]).toHaveTextContent("Lead the Future");
  });

  it("cleanup function removes event listeners", () => {
    const { unmount } = render(
      <KeyInitiatives title="Test Title" initiatives={mockInitiatives} />
    );

    // Mock the removeEventListener to verify it's called
    const removeEventListenerSpy = vi.spyOn(
      Element.prototype,
      "removeEventListener"
    );

    unmount();

    // Should have been called for each card (mouseenter and mouseleave)
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
