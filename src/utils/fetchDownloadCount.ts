export async function fetchDownloadCount(): Promise<number> {
  const res = await fetch("https://api.adoptium.net/v3/stats/downloads/total", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error("Failed to fetch download count");
  const data = await res.json();
  const total = data.total_downloads?.total;
  return typeof total === "number" ? total : 1000000000;
}
