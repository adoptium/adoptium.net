import { describe, it, expect } from "vitest";

describe("i18n/navigation", () => {
  it("should export navigation functions", async () => {
    const navigationModule = await import("../navigation");

    // Test that all expected exports exist
    expect(navigationModule.Link).toBeDefined();
    expect(navigationModule.redirect).toBeDefined();
    expect(navigationModule.usePathname).toBeDefined();
    expect(navigationModule.useRouter).toBeDefined();
    expect(navigationModule.getPathname).toBeDefined();

    // Test that they are the correct types
    expect(typeof navigationModule.redirect).toBe("function");
    expect(typeof navigationModule.usePathname).toBe("function");
    expect(typeof navigationModule.useRouter).toBe("function");
    expect(typeof navigationModule.getPathname).toBe("function");
  });

  it("should export Link component", async () => {
    const { Link } = await import("../navigation");
    expect(Link).toBeDefined();
  });
});
