import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PageHeader from "../index";

// Clean up DOM after each test
afterEach(() => {
    cleanup();
});

describe("PageHeader", () => {
    it("renders title, subtitle, and description as strings", () => {
        render(
            <PageHeader
                title="Test Title"
                subtitle="Test Subtitle"
                description="Test Description"
            />
        );
        expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
        // Title is rendered as HTML, so use getByText with exact: false
        expect(screen.getByText(/Test Title/)).toBeInTheDocument();
    });

    it("renders title and subtitle as React nodes", () => {
        render(
            <PageHeader
                title={<span data-testid="custom-title">Node Title</span>}
                subtitle={<span data-testid="custom-subtitle">Node Subtitle</span>}
                description={<span data-testid="custom-desc">Node Desc</span>}
            />
        );
        expect(screen.getByTestId("custom-title")).toBeInTheDocument();
        expect(screen.getByTestId("custom-subtitle")).toBeInTheDocument();
        expect(screen.getByTestId("custom-desc")).toBeInTheDocument();
    });

    it("returns null if title or subtitle is missing", () => {
        const { container: noTitle } = render(
            <PageHeader subtitle="Test Subtitle" description="desc" title={""} />
        );
        expect(noTitle.firstChild).toBeNull();
        const { container: noSubtitle } = render(
            <PageHeader title="Test Title" description="desc" subtitle={""} />
        );
        expect(noSubtitle.firstChild).toBeNull();
    });

    it("applies custom className to the description container", () => {
        render(
            <PageHeader
                title="Test Title"
                subtitle="Test Subtitle"
                description="desc"
                className="custom-class"
            />
        );
        const desc = screen.getByText("desc");
        expect(desc).toHaveClass("custom-class");
    });
});
