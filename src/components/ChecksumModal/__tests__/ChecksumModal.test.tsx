import React from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, act, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, afterEach } from "vitest"
import ChecksumModal from ".." // Ensure this import path is correct

// Mock next-intl's useTranslations to return the correct i18n values for ChecksumModal
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    if (key === "copied") return "Copied";
    if (key === "copy") return "Copy";
    if (key === "close") return "Close";
    return key;
  }
}))

// Setup for navigator.clipboard mock
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
})

const navigatorClipboardSpy = vi.spyOn(navigator.clipboard, "writeText")

describe("ChecksumModal component", () => {
  // Clean up after each test to remove rendered components
  afterEach(() => {
    cleanup();
    navigatorClipboardSpy.mockClear();
  });

  // Providing the required props for the component to render correctly
  const requiredProps = {
    open: true,
    setOpen: vi.fn(), // Mocking setOpen function
    checksum: "exampleChecksumValue",
  }

  it("ChecksumModal renders correctly", () => {
    const { container } = render(
      <ChecksumModal
        open={true}
        setOpen={() => { }}
        checksum="exampleChecksumValue"
      />,
    )
    // wait for the component to be in the document
    expect(screen.getByText("Checksum (SHA256)")).toBeInTheDocument()
    // Find the input field by its role and ensure it's in the document
    const inputField = screen.getByRole("textbox")
    expect(inputField).toBeInTheDocument()

    // Assert that the input field has the correct value
    expect(inputField).toHaveValue("exampleChecksumValue")
    expect(container).toMatchSnapshot()
  })

  it("ChecksumModal copies correctly", async () => {
    // Reset and set up the navigator.clipboard mock for this test
    navigatorClipboardSpy.mockReset();
    navigatorClipboardSpy.mockResolvedValue(undefined);

    render(<ChecksumModal {...requiredProps} />)

    // Using the test ID to specifically target the main copy button
    // In case there are multiple elements with the same test ID, get all and use the first one
    const mainCopyButtons = screen.getAllByTestId("main-copy-button");
    const mainCopyButton = mainCopyButtons[0];

    // Using act to wait for all state updates and effects to finish
    await act(async () => {
      userEvent.click(mainCopyButton)
    })

    // Since the text changes to "Copied" after the button is clicked and state is updated,
    // we need to ensure the component has re-rendered with the new state
    // Find the button again to ensure we get the updated one
    const copiedButtons = await screen.findAllByText("Copied");
    expect(copiedButtons.length).toBeGreaterThan(0);

    // Wait a tick to ensure async events have completed
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigatorClipboardSpy).toHaveBeenCalledTimes(1)
    expect(navigatorClipboardSpy).toHaveBeenCalledWith("exampleChecksumValue")
  })

  it("Main copy button changes text when clicked", async () => {
    render(<ChecksumModal {...requiredProps} />)

    // First test is stable, so let's keep it simple to verify the component works correctly
    const mainCopyButton = screen.getAllByTestId("main-copy-button")[0];

    // Click the button
    await act(async () => {
      userEvent.click(mainCopyButton);
    });

    // Wait for the button text to change to "Copied"
    const copiedText = await screen.findByText("Copied");
    expect(copiedText).toBeInTheDocument();
  })
})
