type AvailableReleasesResponse = {
  available_lts_releases: number[];
  available_releases: number[];
  most_recent_feature_release: number;
  most_recent_feature_version: number;
  most_recent_lts: number;
  tip_version: number;
};

export async function fetchAvailableReleases(): Promise<AvailableReleasesResponse> {
  const res = await fetch(
    "https://api.adoptium.net/v3/info/available_releases",
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  data.available_releases.sort((a: number, b: number) => b - a);
  data.available_lts_releases.sort((a: number, b: number) => b - a);
  return data;
}
