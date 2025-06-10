export const dynamic = "force-static";
export const revalidate = 3600; // Cache for 1 hour (3600 seconds)

export async function GET() {
  try {
    const response = await fetch(
      "https://api.adoptium.net/v3/info/available_releases",
      {
        next: { revalidate: 3600 }, // Cache the fetch response for 1 hour
        cache: "force-cache", // Use the cache first, only fetch if not in cache
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const rawData = await response.json();

    // Format the data to match component expectations
    const formattedData = {
      most_recent_lts: rawData.most_recent_lts,
      // Format LTS versions to match VersionSelector expectations
      available_lts_releases: rawData.available_lts_releases
        .sort((a: number, b: number) => b - a)
        .map((version: number) => ({
          name: `${version} - LTS`,
          value: version,
        })),
      // Format available versions to match ReleaseSelector expectations
      available_releases: rawData.available_releases
        .sort((a: number, b: number) => b - a)
        .map((version: number) => {
          const isLTS = rawData.available_lts_releases.includes(version);
          return {
            name: isLTS ? `${version} - LTS` : version.toString(),
            value: version.toString(),
          };
        }),
    };

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch latest LTS version" + error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0", // Don't cache errors
        },
      }
    );
  }
}
