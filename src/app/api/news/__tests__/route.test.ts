import { describe, it, expect, vi } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";

const buildRequest = (params: Record<string, string> = {}) => {
  const url = new URL("http://localhost/api/news");
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  return new NextRequest(url.toString());
};

describe("GET /api/news", () => {
  it("returns news with default params and cache headers", async () => {
    const req = buildRequest();
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(
      "public, max-age=3600, stale-while-revalidate=60"
    );
    const data = await res.json();
    expect(data).toBeDefined();
  });

  it("returns news with custom params", async () => {
    const req = buildRequest({ numPosts: "2", page: "2", includeEF: "true" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeDefined();
  });

  it("returns 500 on error", async () => {
    // Simulate error by mocking getNews to throw
    const mod = await import("@/utils/news");
    const spy = vi.spyOn(mod, "getNews").mockImplementation(() => {
      throw new Error("fail");
    });
    const req = buildRequest();
    const res = await GET(req);
    expect(res.status).toBe(500);
    spy.mockRestore();
  });
});
