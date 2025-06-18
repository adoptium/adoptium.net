import { describe, it, expect } from "vitest";
import { safeJsonLd } from "../jsonLd";

describe("safeJsonLd", () => {
  it("serializes and encodes a simple object", () => {
    const obj = { foo: "bar", num: 42 };
    const result = safeJsonLd(obj);
    // Should be a stringified and HTML-encoded version
    expect(result).toContain("foo");
    expect(result).toContain("bar");
    expect(result).toContain("42");
    // Should not contain raw quotes
    expect(result).not.toContain('"');
    // Should contain &quot; for quotes
    expect(result).toContain("&quot;");
  });

  it("escapes </script> tags", () => {
    const obj = { html: "</script><script>alert(1)</script>" };
    const result = safeJsonLd(obj);
    // Should escape </script> as <\/script
    expect(result).toContain("&lt;/script");
    // Should not contain raw </script>
    expect(result).not.toContain("</script>");
  });

  it("handles null and undefined gracefully", () => {
    expect(safeJsonLd(null)).toBe("null");
    expect(safeJsonLd(undefined)).toBe("");
  });
});
