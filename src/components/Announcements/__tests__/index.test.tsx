import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import Announcements from "../index";

// Mock fetch for news and releases
beforeAll(() => {
    global.fetch = vi.fn((url) => {
        let body;
        if (typeof url === "string" && url.includes("byTag")) {
            body = JSON.stringify({ posts: [{ slug: "release-1", year: "2025", month: "06", metadata: { title: "Release 1", description: "Release desc", date: "2025-06-01" } }] });
        } else {
            body = JSON.stringify({ posts: [{ slug: "news-1", year: "2025", month: "06", metadata: { title: "News 1", description: "News desc", date: "2025-06-01" } }] });
        }
        return Promise.resolve(new Response(body, { status: 200, headers: { "Content-Type": "application/json" } }));
    });
});
afterAll(() => {
    vi.restoreAllMocks();
});
afterEach(() => {
    cleanup();
});

describe("Announcements", () => {
    it("renders tabs and loads news, events, and releases", async () => {
        render(<Announcements handleClose={vi.fn()} />);
        // Wait for news to load
        await waitFor(() => expect(screen.getByText("News 1")).toBeInTheDocument());
        // Switch to Releases tab to check for Release 1
        fireEvent.click(screen.getByText("Releases"));
        await waitFor(() => expect(screen.getByText("Release 1")).toBeInTheDocument());
        // Tabs
        expect(screen.getByText("Updates")).toBeInTheDocument();
        expect(screen.getByText("Events")).toBeInTheDocument();
        expect(screen.getByText("Releases")).toBeInTheDocument();
    });

    it("switches tabs when clicked", async () => {
        render(<Announcements handleClose={vi.fn()} />);
        // Wait for news to load
        await waitFor(() => expect(screen.getByText("News 1")).toBeInTheDocument());
        // Switch to Releases
        fireEvent.click(screen.getByText("Releases"));
        expect(screen.getByText("Release 1")).toBeInTheDocument();
        // Switch to Updates
        fireEvent.click(screen.getByText("Updates"));
        expect(screen.getByText("News 1")).toBeInTheDocument();
    });

    it("calls handleClose when sidebar close button is clicked", async () => {
        const handleClose = vi.fn();
        render(<Announcements handleClose={handleClose} />);
        // Wait for news to load
        await waitFor(() => expect(screen.getByText("News 1")).toBeInTheDocument());
        const closeBtn = screen.getByRole("button", { name: /close menu/i });
        fireEvent.click(closeBtn);
        expect(handleClose).toHaveBeenCalled();
    });
});
