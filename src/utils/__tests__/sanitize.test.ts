import { describe, it, expect } from "vitest";
import { sanitizeString, sanitizeObject } from "../sanitize";

describe("sanitizeString", () => {
  it("escapes HTML special characters", () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });

  it("returns empty string for undefined or null", () => {
    expect(sanitizeString(undefined)).toBe("");
    expect(sanitizeString(null)).toBe("");
  });

  it("returns the same string if no special characters", () => {
    expect(sanitizeString("safe string")).toBe("safe string");
  });
});

describe("sanitizeObject", () => {
  it("sanitizes all string values in a flat object", () => {
    const obj = { a: "<b>bold</b>", b: "plain", c: 42 };
    expect(sanitizeObject(obj)).toEqual({
      a: "&lt;b&gt;bold&lt;/b&gt;",
      b: "plain",
      c: 42,
    });
  });

  it("sanitizes nested objects and arrays", () => {
    const obj = {
      a: "<b>bold</b>",
      b: ["x<y>", { c: "z&z" }],
      d: { e: "safe", f: "<img src=x>" },
    };
    expect(sanitizeObject(obj)).toEqual({
      a: "&lt;b&gt;bold&lt;/b&gt;",
      b: ["x&lt;y&gt;", { c: "z&amp;z" }],
      d: { e: "safe", f: "&lt;img src=x&gt;" },
    });
  });

  it("returns primitives as is", () => {
    expect(sanitizeObject(123)).toBe(123);
    expect(sanitizeObject(true)).toBe(true);
    expect(sanitizeObject(null)).toBe(null);
    expect(sanitizeObject(undefined)).toBe(undefined);
  });

  it("sanitizes strings in arrays", () => {
    expect(sanitizeObject(["<a>", "b"])).toEqual(["&lt;a&gt;", "b"]);
  });
});
