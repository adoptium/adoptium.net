import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import CommonHeading from "../index";

afterEach(() => {
    cleanup();
});

describe("CommonHeading", () => {
    it("renders title and description", () => {
        render(
            <CommonHeading title="Test Title" description="Test description." />
        );
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test description.")).toBeInTheDocument();
    });

    it("renders only description if no title is provided", () => {
        render(<CommonHeading description="Only description." />);
        expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
        expect(screen.getByText("Only description.")).toBeInTheDocument();
    });

    it("applies the custom className to the container", () => {
        render(
            <CommonHeading
                title="Title"
                description="Desc"
                className="custom-class"
            />
        );
        const container = screen.getByText("Title").parentElement;
        expect(container).toHaveClass("custom-class");
    });
});
