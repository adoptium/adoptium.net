import { describe, it, expect, vi, afterEach, Mock } from "vitest";
import { GET } from "../route";

global.fetch = vi.fn();

describe("GET /api/available-releases", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns formatted data and cache headers on success", async () => {
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        most_recent_lts: 21,
        available_lts_releases: [17, 21, 11],
        available_releases: [8, 11, 17, 21, 22, 23],
      }),
    });
    const req = new Request("http://localhost/api/available-releases");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    );
    const data = await res.json();
    expect(data.most_recent_lts).toBe(21);
    expect(data.available_lts_releases[0].value).toBe(21);
    expect(data.available_releases[0].value).toBe("23");
  });

  it("returns 500 if response is not ok", async () => {
    (fetch as Mock).mockResolvedValue({ ok: false });
    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("Failed to fetch latest LTS version");
  });

  it("returns 500 if fetch throws", async () => {
    (fetch as Mock).mockRejectedValue(new Error("network error"));
    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("Failed to fetch latest LTS version");
  });
});
