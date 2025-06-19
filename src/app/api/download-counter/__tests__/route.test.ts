import { describe, it, expect, vi, afterEach, Mock } from "vitest";
import { GET } from "../route";

global.fetch = vi.fn();

describe("GET /api/download-counter", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns total downloads on success", async () => {
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ total_downloads: { total: 123456 } }),
    });
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.total).toBe(123456);
  });

  it("returns 500 if response is not ok", async () => {
    (fetch as Mock).mockResolvedValue({ ok: false });
    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to fetch download statistics");
    expect(data.total).toBe(1000000000);
  });

  it("returns 500 if response structure is invalid", async () => {
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to fetch download statistics");
    expect(data.total).toBe(1000000000);
  });

  it("returns 500 if fetch throws", async () => {
    (fetch as Mock).mockRejectedValue(new Error("network error"));
    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to fetch download statistics");
    expect(data.total).toBe(1000000000);
  });
});
