// Utility to fetch available releases for DownloadTable/ReleaseSelector
export async function fetchAvailableReleases(
  ltsOnly = false
): Promise<{ name: string; value: string }[]> {
  const url = ltsOnly
    ? "/api/available-releases?lts-only=true"
    : "/api/available-releases";
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.available_releases || !Array.isArray(data.available_releases))
    return [];
  return data.available_releases.map(
    (v: { name?: string; value: string | number }) => ({
      name: v.name || String(v.value),
      value: String(v.value),
    })
  );
}
