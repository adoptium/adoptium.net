import { describe, afterEach, it, expect, vi } from "vitest";

import { fetchDownloadCount } from "../fetchDownloadCount";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe("fetchDownloadCount", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the total downloads when API returns valid data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total_downloads: { total: 123456789 } }),
    });
    const result = await fetchDownloadCount();
    expect(result).toBe(123456789);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.adoptium.net/v3/stats/downloads/total",
      expect.objectContaining({ next: { revalidate: 3600 } })
    );
  });

  it("returns fallback value if API returns invalid data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total_downloads: { total: null } }),
    });
    const result = await fetchDownloadCount();
    expect(result).toBe(1000000000);
  });

  it("throws if fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchDownloadCount()).rejects.toThrow(
      "Failed to fetch download count"
    );
  });

  it("returns fallback value if API shape is wrong", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ foo: "bar" }),
    });
    const result = await fetchDownloadCount();
    expect(result).toBe(1000000000);
  });
});
