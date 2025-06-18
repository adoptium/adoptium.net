import { describe, it, expect, vi, afterEach, afterAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommonSelector, { ListItem } from "../index";
import { mockAnimationsApi, configMocks } from 'jsdom-testing-mocks';

configMocks({ afterEach, afterAll });
mockAnimationsApi();

const list: ListItem[] = [
    { name: "Option 1", value: "1" },
    { name: "Option 2", value: "2" },
    { name: "Option 3", value: "3" },
];

afterEach(() => {
    cleanup();
});

describe("CommonSelector", () => {
    it("renders with the default value if provided", () => {
        render(
            <CommonSelector
                list={list}
                defaultValue={list[1]}
                selectorUpdater={() => { }}
            />
        );
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("renders the first option if no defaultValue is provided", () => {
        render(<CommonSelector list={list} selectorUpdater={() => { }} />);
        expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("calls selectorUpdater when an option is selected", async () => {
        const updater = vi.fn();
        render(<CommonSelector list={list} selectorUpdater={updater} />);
        const user = userEvent.setup();
        // Open the dropdown
        await user.click(screen.getByRole("button"));
        // Find all options with the text and click the correct one
        const options = await screen.findAllByText("Option 2");
        await user.click(options[options.length - 1]);
        expect(updater).toHaveBeenCalledWith("2");
    });

    it("renders nothing if the list is empty", () => {
        const { container } = render(<CommonSelector list={[]} selectorUpdater={() => { }} />);
        expect(container.firstChild).toBeNull();
    });
});
