"use server";

import fs from "fs";
import path from "path";
import {
  processAsciiDoc,
  extractMetadata,
  getLanguageVariants,
  fileExists,
} from "@/utils/asciidoc";
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases";

// Base directory for AsciiDoc content
const CONTENT_BASE_DIR = path.join(process.cwd(), "content/asciidoc-pages");

export interface SidebarItem {
  title: string;
  href: string;
}

export interface SidebarSection {
  title: string;
  basePath: string;
  items: SidebarItem[];
}

interface AsciidocData {
  content: string;
  metadata: {
    title: string;
    description: string;
    authors: string[];
    attributes: Record<string, unknown>;
  };
  path: string;
  slug: string;
  locale: string;
  availableLocales: string[];
}

export async function getAsciidocContent(
  slug: string,
  locale = "en",
): Promise<AsciidocData | null> {
  // Build the file path
  const slugParts = slug.split("/").filter(Boolean);
  const dirPath = path.resolve(CONTENT_BASE_DIR, ...slugParts);

  // Prevent path traversal: ensure resolved path is within the content directory
  if (!dirPath.startsWith(CONTENT_BASE_DIR)) {
    return null;
  }

  // Try locale-specific file first
  let filePath = path.join(dirPath, `index.${locale}.adoc`);

  // If locale-specific file doesn't exist, fall back to default
  if (!fileExists(filePath)) {
    filePath = path.join(dirPath, "index.adoc");

    // If default doesn't exist either, return null
    if (!fileExists(filePath)) {
      return null;
    }
  }

  try {
    // Read the file content
    const content = fs.readFileSync(filePath, "utf8");

    // Fetch latest LTS version from Adoptium API for AsciiDoc attribute substitution
    let latestLts = 21; // fallback
    try {
      const releases = await fetchAvailableReleases();
      latestLts = releases.most_recent_lts;
    } catch {
      // Use fallback if API is unavailable
    }

    // Process AsciiDoc to HTML
    const htmlContent = processAsciiDoc(filePath, content, {
      attributes: {
        "latest-lts": String(latestLts),
      },
    });

    // Extract metadata
    const metadata = extractMetadata(filePath, content);

    // Get available locales for this page
    const availableLocales = getLanguageVariants(filePath, "index");

    return {
      content: htmlContent as string,
      metadata,
      path: filePath,
      slug,
      locale: locale || "en",
      availableLocales,
    };
  } catch (error) {
    console.error(`Error processing AsciiDoc file at ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all AsciiDoc files for dynamic route generation
 */
export async function getAllAsciidocPaths() {
  const paths: { slug: string; locale: string }[] = [];

  function traverseDirectory(dir: string, currentPath: string[] = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== "_partials") {
        // Skip _partials directories
        traverseDirectory(path.join(dir, entry.name), [
          ...currentPath,
          entry.name,
        ]);
      } else if (entry.isFile() && entry.name.endsWith(".adoc")) {
        const match = entry.name.match(/^index(?:\.([a-zA-Z0-9_-]+))?\.adoc$/);

        if (match) {
          const locale = match[1] || "en";
          const slug = currentPath.join("/");

          paths.push({
            slug,
            locale,
          });
        }
      }
    }
  }

  traverseDirectory(CONTENT_BASE_DIR);
  return paths;
}

/**
 * Get all pages in a specific section
 * @param section Section name (e.g., 'docs', 'installation')
 * @param locale Preferred locale
 */
export async function getPagesInSection(section: string, locale = "en") {
  const allPaths = await getAllAsciidocPaths();

  // Filter pages that are in the specified section
  return allPaths.filter(
    (path) =>
      path.slug.startsWith(section) &&
      path.slug !== section && // Exclude the section itself
      (path.locale === locale || path.locale === "en"), // Include preferred locale and English fallback
  );
}

// Section display names
const SECTION_TITLES: Record<string, string> = {
  installation: "Installation",
  docs: "Documentation",
  temurin: "Temurin",
  about: "About",
  support: "Support",
  contributing: "Contributing",
  jmc: "JMC",
};

/**
 * Build sidebar navigation data for a given section by scanning the filesystem.
 * Returns the section title and a sorted list of items with titles extracted
 * from each AsciiDoc page's document title.
 *
 * The `section` parameter can be a top-level section like "docs" or a nested
 * path like "docs/reproducible-verification-builds" for subsections that
 * contain their own child pages.
 */
export async function getSidebarData(
  section: string,
  locale = "en",
): Promise<SidebarSection | null> {
  // Validate inputs: each segment must only contain alphanumeric, hyphens, and underscores
  const segments = section.split("/");
  if (!segments.every((s) => /^[a-zA-Z0-9_-]+$/.test(s))) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(locale)) return null;

  const sectionDir = path.resolve(CONTENT_BASE_DIR, ...segments);

  // Prevent path traversal
  if (!sectionDir.startsWith(CONTENT_BASE_DIR)) return null;
  if (!fs.existsSync(sectionDir) || !fs.lstatSync(sectionDir).isDirectory())
    return null;

  const items: SidebarItem[] = [];

  // Check for a root index page (e.g. /installation)
  const rootIndex = fileExists(path.join(sectionDir, `index.${locale}.adoc`))
    ? path.join(sectionDir, `index.${locale}.adoc`)
    : fileExists(path.join(sectionDir, "index.adoc"))
      ? path.join(sectionDir, "index.adoc")
      : null;

  if (rootIndex) {
    const content = fs.readFileSync(rootIndex, "utf8");
    const meta = extractMetadata(rootIndex, content);
    items.push({ title: "Overview", href: `/${section}` });
    // Use "Overview" as the label for the root page to keep it short
    void meta; // title available if needed later
  }

  // Scan subdirectories for child pages
  const entries = fs.readdirSync(sectionDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "_partials") continue;

    const childDir = path.join(sectionDir, entry.name);
    const childFile = fileExists(path.join(childDir, `index.${locale}.adoc`))
      ? path.join(childDir, `index.${locale}.adoc`)
      : fileExists(path.join(childDir, "index.adoc"))
        ? path.join(childDir, "index.adoc")
        : null;

    if (!childFile) continue;

    const content = fs.readFileSync(childFile, "utf8");
    const meta = extractMetadata(childFile, content);
    const sidebarTitle = meta.attributes["page-sidebar-title"];
    items.push({
      title: sidebarTitle ? String(sidebarTitle) : meta.title,
      href: `/${section}/${entry.name}`,
    });
  }

  // Sort child items alphabetically by title (keep Overview first if present)
  const overview = items.find((i) => i.title === "Overview");
  const rest = items
    .filter((i) => i.title !== "Overview")
    .sort((a, b) => a.title.localeCompare(b.title));

  // Determine a human-readable title for the sidebar section
  const topLevel = segments[0];
  const lastSegment = segments[segments.length - 1];
  let sectionTitle =
    SECTION_TITLES[topLevel] ||
    topLevel.charAt(0).toUpperCase() + topLevel.slice(1);
  // For nested sections, derive title from the index page or last segment
  if (segments.length > 1) {
    const rootIndex = fileExists(path.join(sectionDir, `index.${locale}.adoc`))
      ? path.join(sectionDir, `index.${locale}.adoc`)
      : fileExists(path.join(sectionDir, "index.adoc"))
        ? path.join(sectionDir, "index.adoc")
        : null;
    if (rootIndex) {
      const rootContent = fs.readFileSync(rootIndex, "utf8");
      const rootMeta = extractMetadata(rootIndex, rootContent);
      sectionTitle = rootMeta.title;
    } else {
      sectionTitle =
        lastSegment.charAt(0).toUpperCase() +
        lastSegment.slice(1).replace(/-/g, " ");
    }
  }

  return {
    title: sectionTitle,
    basePath: `/${section}`,
    items: overview ? [overview, ...rest] : rest,
  };
}
