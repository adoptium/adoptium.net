export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate once per hour

export async function GET() {
  try {
    const response = await fetch(
      "https://api.adoptium.net/v3/stats/downloads/total"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const stats = await response.json();

    // Extract the total downloads count from the response and return directly
    if (
      stats.total_downloads &&
      typeof stats.total_downloads.total === "number"
    ) {
      return Response.json({ total: stats.total_downloads.total });
    } else {
      throw new Error("Invalid response structure from Adoptium API");
    }
  } catch (error) {
    console.error("Error fetching download count:", error);
    // Return a fallback value in case of errors
    return Response.json(
      { total: 1000000000, error: "Failed to fetch download statistics" },
      { status: 500 }
    );
  }
}
