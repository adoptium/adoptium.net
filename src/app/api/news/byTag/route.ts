import { NextRequest } from "next/server";
import { getNewsByTag } from "@/utils/news";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const numPosts = parseInt(searchParams.get("numPosts") || "6", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    if (!tag) {
      return Response.json({ error: "Missing tag parameter" }, { status: 400 });
    }
    const news = getNewsByTag(tag, { numPosts, page });
    return Response.json(news, {
      headers: {
        "Cache-Control": "public, max-age=14400, stale-while-revalidate=60",
      },
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch news by tag" },
      { status: 500 }
    );
  }
}
