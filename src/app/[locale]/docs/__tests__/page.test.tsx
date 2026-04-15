import React from "react";
import { render, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

import Docs from "../page";

describe("Docs page", () => {
  it("renders correctly", async () => {
    const Page = await Docs();
    const { container } = render(Page);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no accessibility violations", async () => {
    const Page = await Docs();
    const { container } = render(Page);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
