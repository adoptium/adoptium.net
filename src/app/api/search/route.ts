import { NextRequest, NextResponse } from "next/server";
import {
  getAllAsciidocPaths,
  getAsciidocContent,
} from "@/services/asciidocService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const query = searchParams.get("q") || "";
  if (query.length < 2) return NextResponse.json([]);

  const paths = await getAllAsciidocPaths();
  const results = [];
  for (const p of paths) {
    const doc = await getAsciidocContent(p.slug, p.locale);
    if (!doc) continue;
    const title = doc.metadata.title || "";
    const desc = doc.metadata.description || "";
    if (
      title.toLowerCase().includes(query.toLowerCase()) ||
      desc.toLowerCase().includes(query.toLowerCase())
    ) {
      results.push({
        title,
        desc,
        slug: p.slug,
        locale: p.locale,
      });
    }
  }
  return NextResponse.json(results);
}
