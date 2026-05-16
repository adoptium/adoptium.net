import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import SupportedPlatforms from "../page";

vi.mock("@/data/supported-platforms.json", () => ({
  default: {
    platforms: [
      {
        category: "Mock OS (x64)",
        footnotes: ["This is a test footnote"],
        distros: [
          {
            name: "Mock Distro 1",
            versions: {
              "8": { supported: true, docker: true },
              "11": { supported: true, docker: false },
              "17": { supported: false, docker: false },
            },
          },
        ],
      },
    ],
  },
}));

describe("Supported Platforms page", () => {
  it("renders correctly", () => {
    const { container } = render(<SupportedPlatforms />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SupportedPlatforms />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
