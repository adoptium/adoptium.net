import { describe, it, expect, vi } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";

const buildRequest = (params: Record<string, string> = {}) => {
  const url = new URL("http://localhost/api/news/byTag");
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  return new NextRequest(url.toString());
};

describe("GET /api/news/byTag", () => {
  it("returns 400 if tag is missing", async () => {
    const req = buildRequest();
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing tag parameter");
  });

  it("returns news with tag and cache headers", async () => {
    const req = buildRequest({ tag: "temurin" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(
      "public, max-age=3600, stale-while-revalidate=60"
    );
    const data = await res.json();
    expect(data).toBeDefined();
  });

  it("returns news with custom params", async () => {
    const req = buildRequest({ tag: "temurin", numPosts: "2", page: "2" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeDefined();
  });

  it("returns 500 on error", async () => {
    const mod = await import("@/utils/news");
    const spy = vi.spyOn(mod, "getNewsByTag").mockImplementation(() => {
      throw new Error("fail");
    });
    const req = buildRequest({ tag: "temurin" });
    const res = await GET(req);
    expect(res.status).toBe(500);
    spy.mockRestore();
  });
});
