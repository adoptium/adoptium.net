"use server";

import fs from "fs";
import path from "path";
import {
  processAsciiDoc,
  extractMetadata,
  getLanguageVariants,
  fileExists,
} from "@/utils/asciidoc";

// Base directory for AsciiDoc content
const CONTENT_BASE_DIR = path.join(process.cwd(), "content/asciidoc-pages");

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
  locale = "en"
): Promise<AsciidocData | null> {
  // Build the file path
  const slugParts = slug.split("/").filter(Boolean);
  const dirPath = path.join(CONTENT_BASE_DIR, ...slugParts);

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

    // Process AsciiDoc to HTML
    const htmlContent = processAsciiDoc(filePath, content);

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
      (path.locale === locale || path.locale === "en") // Include preferred locale and English fallback
  );
}
