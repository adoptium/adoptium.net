import type { MetadataRoute } from "next";
import { getAppRoutes, getBlogRoutes } from "@/utils/getAppRoutes";
import { routing } from "@/i18n/routing";
import { getAllStaticSitemapUrls } from "@/utils/sitemapData";
import fs from "fs";
import path from "path";
import authorsData from "@/data/authors.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adoptium.net";

  const staticRoutes = getAppRoutes().filter(
    (route) => !route.includes("[...slug]") && !route.startsWith("/news")
  );

  // Getting additional routes from sitemap data to ensure all proposal URLs are included
  const sitemapUrls = getAllStaticSitemapUrls();
  const additionalRoutes = sitemapUrls
    .map(url => url.replace(/\/$/, '')) // Removing trailing slashes for consistency
    .filter(url => !staticRoutes.includes(url)); // Adding routes not already added in static routes

  const allStaticRoutes = [...staticRoutes, ...additionalRoutes];

  const blogRoutes = getBlogRoutes();

  // Collect asciidoc routes from content/asciidoc-pages (recursive)
  function getAsciidocRoutes(dir: string, prefix = ""): string[] {
    let routes: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        routes = routes.concat(
          getAsciidocRoutes(
            path.join(dir, entry.name),
            `${prefix}/${entry.name}`
          )
        );
      } else if (entry.isFile() && entry.name.endsWith(".adoc")) {
        const route = `${prefix}/${entry.name.replace(/\index.adoc$/, "")}`;
        routes.push(route);
      }
    }
    return routes;
  }
  const asciidocDir = path.join(process.cwd(), "content/asciidoc-pages");
  let asciidocRoutes: string[] = [];
  try {
    asciidocRoutes = getAsciidocRoutes(asciidocDir);
  } catch {}

  const entries: MetadataRoute.Sitemap = [];

  // Build a set of canonical URLs handled by asciidoc index pages
  const asciidocCanonicalSet = new Set<string>();
  for (const route of asciidocRoutes) {
    const match = route.match(/(.+?)\/index(?:\.(\w{2,5}))?\.adoc$/);
    if (match) {
      const canonical = `${match[1]}/`;
      asciidocCanonicalSet.add(canonical);
    }
  }

  // Static pages (localized), but skip those handled by asciidoc index pages
  for (const route of allStaticRoutes) {
    const isRoot = route === "/";
    const canonical = isRoot ? "/" : route.endsWith("/") ? route : `${route}/`;
    if (!isRoot && asciidocCanonicalSet.has(canonical)) continue;
    const defaultUrl = isRoot ? `${baseUrl}/` : `${baseUrl}${route}`;
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      if (locale === routing.defaultLocale) continue;
      languages[locale] = isRoot
        ? `${baseUrl}/${locale}`
        : `${baseUrl}/${locale}${route}`;
    }
    // Add x-default hreflang pointing to the default locale
    if (Object.keys(languages).length > 0) {
      languages["x-default"] = defaultUrl;
    }
    entries.push({
      url: defaultUrl,
      lastModified: undefined,
      alternates: Object.keys(languages).length > 0 ? { languages } : undefined,
    });
  }

  // Blog/news pages (not localized, with date)
  for (const blog of blogRoutes) {
    const url = `${baseUrl}${blog.loc}`;
    let lastModified: Date | undefined = undefined;
    const match = blog.loc.match(/\/news\/(\d{4})\/(\d{2})/);
    if (match) {
      const [year, month] = match.slice(1);
      lastModified = new Date(Number(year), Number(month) - 1, 1);
    }
    entries.push({
      url,
      lastModified,
    });
  }

  // Author pages (localized)
  const authorRoutes = getAuthorRoutes();
  for (const route of authorRoutes) {
    const defaultUrl = `${baseUrl}${route}`;
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      if (locale === routing.defaultLocale) continue;
      languages[locale] = `${baseUrl}/${locale}${route}`;
    }
    // Add x-default hreflang pointing to the default locale
    if (Object.keys(languages).length > 0) {
      languages["x-default"] = defaultUrl;
    }
    entries.push({
      url: defaultUrl,
      lastModified: undefined,
      alternates: Object.keys(languages).length > 0 ? { languages } : undefined,
    });
  }

  // Asciidoc pages (localized by file extension)
  // Group by canonical path (parent dir) and collect language variants
  const asciidocMap: Record<string, Record<string, string>> = {};
  for (const route of asciidocRoutes) {
    // Match /foo/bar/index(.xx)?.adoc
    const indexMatch = route.match(/(.+?)\/index(?:\.(\w{2,5}))?\.adoc$/);
    if (indexMatch) {
      const canonical = `${indexMatch[1]}/`;
      const lang = indexMatch[2] || routing.defaultLocale;
      if (!asciidocMap[canonical]) asciidocMap[canonical] = {};
      asciidocMap[canonical][lang] = `${canonical}`;
      continue;
    }
    // Otherwise, treat as a regular page (no index)
    const match = route.match(/(.+?)(?:\.(\w{2,5}))?$/);
    if (!match) continue;
    const base = match[1];
    const lang = match[2] || routing.defaultLocale;
    if (!asciidocMap[base]) asciidocMap[base] = {};
    asciidocMap[base][lang] = `${base}${match[2] ? "." + match[2] : ""}`;
  }
  for (const base in asciidocMap) {
    const langs = asciidocMap[base];
    if (!langs[routing.defaultLocale]) continue;
    // Canonical URL: always ends with a slash
    let normalizedBase = base.startsWith("/") ? base : `/${base}`;
    normalizedBase = normalizedBase.replace(/\/+/g, "/");
    const defaultUrl = `${baseUrl}${normalizedBase}`;
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      if (locale === routing.defaultLocale) continue;
      if (langs[locale]) {
        languages[locale] = `${baseUrl}/${locale}${normalizedBase}`;
      }
    }
    // Add x-default hreflang pointing to the default locale
    if (Object.keys(languages).length > 0) {
      languages["x-default"] = defaultUrl;
    }
    entries.push({
      url: defaultUrl,
      lastModified: undefined,
      alternates: Object.keys(languages).length > 0 ? { languages } : undefined,
    });
  }

  // Collect author routes from authors.json
  function getAuthorRoutes(): string[] {
    try {
      return Object.keys(authorsData).map(
        (authorId) => `/news/author/${authorId}/`
      );
    } catch {
      return [];
    }
  }

  return entries;
}
