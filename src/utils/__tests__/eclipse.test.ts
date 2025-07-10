import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { fetchLatestNews } from "../eclipse";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("fetchLatestNews", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("returns data from the API on success", async () => {
    const mockData = {
      news: [{ id: 1, title: "Test News" }],
      pager: { page: 1 },
    };
    mock.onGet(/\/news/).reply(200, mockData);

    const result = await fetchLatestNews();
    expect(result).toEqual(mockData);
  });

  it("returns default empty news and pager on error", async () => {
    mock.onGet(/\/news/).reply(500);
    const result = await fetchLatestNews();
    expect(result).toEqual({ news: [], pager: null });
  });
});
