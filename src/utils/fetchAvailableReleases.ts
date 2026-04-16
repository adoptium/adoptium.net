import type { operations } from "@/types/adoptiumApiTypes";

type AvailableReleasesResponse = NonNullable<
  operations["getAvailableReleases"]["responses"][200]["content"]["application/json"]
>;

export async function fetchAvailableReleases(): Promise<AvailableReleasesResponse> {
  const res = await fetch(
    "https://api.adoptium.net/v3/info/available_releases",
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    },
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  data.available_releases.sort((a: number, b: number) => b - a);
  data.available_lts_releases.sort((a: number, b: number) => b - a);
  return data;
}
