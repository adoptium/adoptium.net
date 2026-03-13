import { NextRequest } from "next/server";
import { getNews } from "@/utils/news";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const numPosts = parseInt(searchParams.get("numPosts") || "4", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const includeEF = searchParams.get("includeEF") !== "false";

    const tag = searchParams.get("tag") || undefined;
    const author = searchParams.get("author") || undefined;
    const sourceParam = searchParams.get("source") || undefined;

    const source =
      sourceParam === "adoptium" || sourceParam === "eclipse"
        ? sourceParam
        : undefined;

    const news = await getNews({
      numPosts,
      page,
      includeEF,
      tag,
      author,
      source,
    });

    return Response.json(news, {
      headers: {
        "Cache-Control": "public, max-age=14400, stale-while-revalidate=60",
      },
    });
  } catch {
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
