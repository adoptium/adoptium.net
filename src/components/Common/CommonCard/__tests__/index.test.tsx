import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CommonCard from "../index";

const mockData = {
    title: "Test Title",
    description: "This is a test description.",
    href: "/test-link",
    button: "Click Me",
};

describe("CommonCard", () => {
    it("renders the title, description, and button", () => {
        render(<CommonCard data={mockData} />);
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("This is a test description.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
    });

    it("renders the correct link for the button", () => {
        render(<CommonCard data={mockData} />);
        const links = screen.getAllByRole("link");
        // There should be only one link in this render
        expect(links[0]).toHaveAttribute("href", "/test-link");
    });

    it("applies the correct classes", () => {
        render(<CommonCard data={mockData} />);
        const card = screen.getAllByTestId("common-card")[0];
        expect(card).toHaveClass("common-card");
    });
});
