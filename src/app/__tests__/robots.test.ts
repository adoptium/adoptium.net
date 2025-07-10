import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import robots from "../robots";

// Type for the specific rules structure returned by our robots function
type RobotsRules = {
  userAgent: string;
  allow: string;
  disallow: string;
};

describe("robots.ts", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns robots configuration with default URL when NEXT_PUBLIC_SITE_URL is not set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const result = robots();

    expect(result).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      sitemap: "https://adoptium.net/sitemap.xml",
    });
  });

  it("returns robots configuration with custom URL when NEXT_PUBLIC_SITE_URL is set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://custom.example.com";

    const result = robots();

    expect(result).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      sitemap: "https://custom.example.com/sitemap.xml",
    });
  });

  it("allows all user agents", () => {
    const result = robots();
    const rules = result.rules as RobotsRules;
    expect(rules.userAgent).toBe("*");
  });

  it("allows root path", () => {
    const result = robots();
    const rules = result.rules as RobotsRules;
    expect(rules.allow).toBe("/");
  });

  it("disallows API routes", () => {
    const result = robots();
    const rules = result.rules as RobotsRules;
    expect(rules.disallow).toBe("/api/");
  });
});
