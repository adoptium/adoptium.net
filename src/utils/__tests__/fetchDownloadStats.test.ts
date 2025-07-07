import { describe, afterEach, it, expect, vi } from "vitest";

import { fetchDownloadStats } from "../fetchDownloadStats";

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
    const result = (await fetchDownloadStats()).total_downloads.total;
    expect(result).toBe(123456789);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.adoptium.net/v3/stats/downloads/total",
      expect.objectContaining({ next: { revalidate: 3600 } })
    );
  });

  it("throws if fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchDownloadStats()).rejects.toThrow(
      "Failed to fetch download data"
    );
  });
});
