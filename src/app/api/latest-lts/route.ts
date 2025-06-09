export const dynamic = "force-static";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.adoptium.net/v3/info/available_releases"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const releases = await response.json();
    const data = { version: releases.most_recent_lts };
    return Response.json({ mostRecentLts: data });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch latest LTS version" + error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
