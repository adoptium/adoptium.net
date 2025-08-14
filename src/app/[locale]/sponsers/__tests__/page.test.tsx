import { describe, it, expect, vi } from "vitest";

// Mock the next/navigation module before it's imported by Page
vi.mock("next/navigation", () => ({
  redirect: vi.fn()
}));

import { redirect } from "next/navigation";
import Page from "../page";

describe("Sponsers Page", () => {
  it("calls redirect to /sustainers", () => {
    Page();
    expect(redirect).toHaveBeenCalledWith("/sustainers");
  });
});
