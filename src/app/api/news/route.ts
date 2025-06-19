import { NextRequest } from "next/server";
import { getNews } from "@/utils/news";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const numPosts = parseInt(searchParams.get("numPosts") || "4", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const includeEF = searchParams.get("includeEF") === "true";
    const news = await getNews({ numPosts, page, includeEF });
    return Response.json(news, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
      },
    });
  } catch {
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
