import { describe, it, expect, afterEach, afterAll, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectorHeader from "../index";
import { mockAnimationsApi, configMocks } from 'jsdom-testing-mocks';

configMocks({ afterEach, afterAll });
mockAnimationsApi();

const titles = ["First", "Second"];
const data = [
    [
        { name: "A", value: "a" },
        { name: "B", value: "b" },
    ],
    [
        { name: "X", value: "x" },
        { name: "Y", value: "y" },
    ],
];

afterEach(() => {
    cleanup();
});

describe("SelectorHeader", () => {
    it("renders all selectors and titles", () => {
        render(
            <SelectorHeader
                title={titles}
                data={data}
                selectorUpdater={[vi.fn(), vi.fn()]}
            />
        );
        expect(screen.getByText("First")).toBeInTheDocument();
        expect(screen.getByText("Second")).toBeInTheDocument();
        // Only count selector buttons (aria-haspopup="listbox")
        const selectorButtons = screen.getAllByRole("button").filter(
            (btn) => btn.getAttribute("aria-haspopup") === "listbox"
        );
        expect(selectorButtons.length).toBe(2);
    });

    it("calls the correct selectorUpdater when an option is selected", async () => {
        const updater1 = vi.fn();
        const updater2 = vi.fn();
        render(
            <SelectorHeader
                title={titles}
                data={data}
                selectorUpdater={[updater1, updater2]}
            />
        );
        const user = userEvent.setup();
        // Open the first selector and select the second option
        const selectorButtons = screen.getAllByRole("button").filter(
            (btn) => btn.getAttribute("aria-haspopup") === "listbox"
        );
        await user.click(selectorButtons[0]);
        const optionsB = await screen.findAllByText("B");
        await user.click(optionsB[optionsB.length - 1]);
        expect(updater1).toHaveBeenCalledWith("b");
        // Open the second selector and select the second option
        await user.click(selectorButtons[1]);
        const optionsY = await screen.findAllByText("Y");
        await user.click(optionsY[optionsY.length - 1]);
        expect(updater2).toHaveBeenCalledWith("y");
    });

    it("applies default values if provided", () => {
        render(
            <SelectorHeader
                title={titles}
                data={data}
                selectorUpdater={[vi.fn(), vi.fn()]}
                defaultValues={["b", "y"]}
            />
        );
        expect(screen.getByText("B")).toBeInTheDocument();
        expect(screen.getByText("Y")).toBeInTheDocument();
    });

    it("toggles mobile filters visibility", () => {
        render(
            <SelectorHeader
                title={titles}
                data={data}
                selectorUpdater={[vi.fn(), vi.fn()]}
            />
        );
        const filterBtn = screen.getByRole("button", { name: /filter/i });
        // Should be hidden initially on mobile
        const filterPanel = screen.getByText("First").closest(".hidden");
        expect(filterPanel).not.toBeNull();
        // Click to open
        fireEvent.click(filterBtn);
        // Now should be visible
        expect(screen.getByText("First").closest(".block")).not.toBeNull();
    });
});
