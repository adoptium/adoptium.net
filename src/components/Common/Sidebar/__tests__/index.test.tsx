import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Sidebar from "../index";

afterEach(() => {
    cleanup();
});

describe("Sidebar", () => {
    it("renders header and children", () => {
        render(
            <Sidebar header="Test Header" onClose={vi.fn()}>
                <div data-testid="sidebar-child">Child Content</div>
            </Sidebar>
        );
        expect(screen.getByText("Test Header")).toBeInTheDocument();
        expect(screen.getByTestId("sidebar-child")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
        const onClose = vi.fn();
        render(
            <Sidebar header="Header" onClose={onClose}>
                <div>Content</div>
            </Sidebar>
        );
        const closeBtn = screen.getByRole("button", { name: /close menu/i });
        fireEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalled();
    });

    it("renders the close icon", () => {
        render(
            <Sidebar header="Header" onClose={vi.fn()}>
                <div>Content</div>
            </Sidebar>
        );
        // Check for the SVG element directly
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });
});
