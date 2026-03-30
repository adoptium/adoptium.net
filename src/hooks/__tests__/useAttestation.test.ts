import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { describe, it, expect, vi, afterEach, afterAll } from "vitest";

import { useAttestations } from "../useAttestations";

const mock = new MockAdapter(axios);

afterEach(() => {
  vi.clearAllMocks();
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

const mockAttestations = [
  {
    target_checksum: "checksum-1",
    predicate_type: "https://slsa.dev/provenance/v1",
  },
];

// Test 1 Guard clause (no release name))
it("does not fetch when releaseName is undefined", async () => {
  const spy = vi.spyOn(axios, "get");

  renderHook(() => useAttestations(undefined, ["checksum-1"]));

  expect(spy).not.toHaveBeenCalled();
});

//Test 2 fetch and normalize
it("fetches attestations and normalizes by checksum", async () => {
  mock
    .onGet(
      "https://api.adoptium.net/v3/attestations/release_name/release_name_mock",
      { params: { project: "jdk" } }
    )
    .reply(200, [{ target_checksum: "checksum-1" }]);

  const { result } = renderHook(() =>
    useAttestations("release_name_mock", ["checksum-1"])
  );

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.attestations["checksum-1"]).toBeDefined();
});

// Test 3 partial matches
it("sets undefined for checksums not returned by the API", async () => {
  mock.onGet().reply(200, [{ target_checksum: "checksum-1" }]);

  const { result } = renderHook(() =>
    useAttestations("release_name_mock", ["checksum-1", "checksum-2"])
  );

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.attestations["checksum-1"]).toBeDefined();
  expect(result.current.attestations["checksum-2"]).toBeUndefined();
});

//Test 4 404 is NOT an error
it("handles 404 responses by caching undefined attestations", async () => {
  mock.onGet().reply(404);

  const { result } = renderHook(() =>
    useAttestations("release_name_mock", ["checksum-1"])
  );

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.error).toBeUndefined();
  expect(result.current.attestations["checksum-1"]).toBeUndefined();
});

//Test 5 non-404 error surfaces
it("exposes error for non-404 failures", async () => {
  mock.onGet().reply(500);

  const { result } = renderHook(() =>
    useAttestations("release_name_mock", ["checksum-1"])
  );

  await waitFor(() => {
    expect(result.current.error).toBeDefined();
  });
});

//Test 6 caching prevents refetch
it("does not refetch attestations for cached checksums", async () => {
  mock.onGet().reply(200, [{ target_checksum: "checksum-1" }]);

  const spy = vi.spyOn(axios, "get");

  const { rerender } = renderHook(
    ({ checksums }) => useAttestations("release_name_mock", checksums),
    {
      initialProps: { checksums: ["checksum-1"] },
    }
  );

  // Wait until at least one fetch has happened
  await waitFor(() => {
    expect(spy).toHaveBeenCalled();
  });

  const callsAfterFirstFetch = spy.mock.calls.length;

  // Rerender with the same checksum
  rerender({ checksums: ["checksum-1"] });

  // Allow effects to flush
  await new Promise((r) => setTimeout(r, 0));

  expect(spy.mock.calls.length).toBe(callsAfterFirstFetch);
});
