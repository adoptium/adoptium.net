import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterAll, afterEach } from "vitest";
import { useArches, useOses } from "../fetchConstants";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

afterEach(() => {
  vi.clearAllMocks();
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

describe("useArches", () => {
  it("URL is set correctly", async () => {
    const mockResponse = ["mock_aarch64"];

    mock.onGet().reply(200, mockResponse);
    const spy = vi.spyOn(axios, "get");

    const { result } = renderHook(() => useArches(true));

    await waitFor(
      () => {
        expect(result.current.length).toBeGreaterThan(0);
      },
      { interval: 1 }
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "https://api.adoptium.net/v3/types/architectures"
    );
    expect(result.current).toMatchSnapshot();
  });

  it("Result is empty on error", async () => {
    mock.onGet().reply(500);
    const spy = vi.spyOn(axios, "get");

    const { result } = renderHook(() => useArches(true));
    await waitFor(
      () => {
        expect(result.current.length).toBe(0);
      },
      { interval: 1 }
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("useOses", () => {
  it("URL is set correctly", async () => {
    const mockResponse = ["mock_linux"];

    mock.onGet().reply(200, mockResponse);
    const spy = vi.spyOn(axios, "get");

    const { result } = renderHook(() => useOses(true));

    await waitFor(
      () => {
        expect(result.current.length).toBeGreaterThan(0);
      },
      { interval: 1 }
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "https://api.adoptium.net/v3/types/operating_systems"
    );
    expect(result.current).toMatchSnapshot();
  });

  it("Result is empty on error", async () => {
    mock.onGet().reply(500);
    const spy = vi.spyOn(axios, "get");

    const { result } = renderHook(() => useOses(true));
    await waitFor(
      () => {
        expect(result.current.length).toBe(0);
      },
      { interval: 1 }
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
