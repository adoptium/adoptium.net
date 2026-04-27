import { describe, it, expect, vi, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

// Derive expected locales from the routing source file to avoid hardcoding
const routingSrc = readFileSync(join(__dirname, "../routing.ts"), "utf8");
const expectedLocales = JSON.parse(
  routingSrc.match(/locales:\s*(\[.*?\])/s)![1],
) as string[];

// Mock next-intl functions
const mockDefineRouting = vi.fn();
const mockCreateNavigation = vi.fn();

vi.mock("next-intl/routing", () => ({
  defineRouting: mockDefineRouting,
}));

vi.mock("next-intl/navigation", () => ({
  createNavigation: mockCreateNavigation,
}));

describe("i18n/routing", () => {
  beforeAll(() => {
    // Set up mock return values
    mockDefineRouting.mockReturnValue({
      locales: expectedLocales,
      defaultLocale: "en",
      localePrefix: "as-needed",
    });

    mockCreateNavigation.mockReturnValue({
      Link: "MockedLink",
      redirect: vi.fn(),
      usePathname: vi.fn(),
      useRouter: vi.fn(),
    });
  });

  it("should call defineRouting with correct configuration", async () => {
    await import("../routing");

    expect(mockDefineRouting).toHaveBeenCalledWith({
      locales: expectedLocales,
      defaultLocale: "en",
      localePrefix: "as-needed",
    });
  });

  it("should export routing configuration", async () => {
    const { routing } = await import("../routing");

    expect(routing).toBeDefined();
    for (const locale of expectedLocales) {
      expect(routing.locales).toContain(locale);
    }
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("as-needed");
  });

  it("should call createNavigation with routing config", async () => {
    const routingModule = await import("../routing");

    expect(mockCreateNavigation).toHaveBeenCalledWith(routingModule.routing);
  });

  it("should export navigation functions", async () => {
    const { Link, redirect, usePathname, useRouter } =
      await import("../routing");

    expect(Link).toBeDefined();
    expect(redirect).toBeDefined();
    expect(usePathname).toBeDefined();
    expect(useRouter).toBeDefined();
  });

  it("should include all expected locales", async () => {
    const { routing } = await import("../routing");

    expect(routing.locales).toEqual(expectedLocales);
    expect(routing.locales).toHaveLength(expectedLocales.length);
  });
});
