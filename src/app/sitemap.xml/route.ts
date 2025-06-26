import { routing } from "@/i18n/routing";
import { getAppRoutes, getBlogRoutes } from "@/utils/getAppRoutes";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://adoptium-next.netlify.app";
  const routes = getAppRoutes().filter(
    (route) => !route.includes("[...slug]") && !route.startsWith("/news")
  );
  const blogRoutes = getBlogRoutes();

  const urls: string[] = [];

  for (const locale of routing.locales) {
    // Static pages
    for (const path of routes) {
      const localizedPath = path === "/" ? "" : path;
      urls.push(`${baseUrl}/${locale}${localizedPath}`);
    }

    // Blogs (replaces /en/ with current locale)
    for (const blog of blogRoutes) {
      const localizedBlogPath = blog.loc.replace(/^\/en\//, `/${locale}/`);
      urls.push(`${baseUrl}${localizedBlogPath}`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `<url>
  <loc>${loc}</loc>
</url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
