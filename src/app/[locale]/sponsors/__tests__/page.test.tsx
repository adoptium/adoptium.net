import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn()
}));

import { redirect } from "next/navigation";
import Page from "../page";

describe("Sponsors Page", () => {
  it("calls redirect to /sustainers", () => {
    Page();
    expect(redirect).toHaveBeenCalledWith("/sustainers");
  });
});
