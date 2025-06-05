import React from "react"

import { render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import ShellBox from "../index"

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

const navigatorClipboardSpy = vi.spyOn(navigator.clipboard, "writeText")

afterEach(() => {
  vi.clearAllMocks()
})

describe("ShellBox component", (): void => {
  it("renders correctly", (): void => {
    const textToCopy = "text to be copy"
    const { container } = render(
      <ShellBox textToCopy={textToCopy}>mock-children-code</ShellBox>,
    )
    expect(container).toMatchSnapshot()
  })

  it("can copy text to clipboard", async () => {
    const textToCopy = "text to be copy"
    const { getByRole } = render(
      <ShellBox textToCopy={textToCopy}>mock-children-code</ShellBox>,
    )

    // Simulate clicking the copy button
    const copyButton = getByRole('button');
    copyButton.click();

    // Verify the clipboard writeText was called with the correct text
    expect(navigatorClipboardSpy).toHaveBeenCalledWith(textToCopy);
  })
})
