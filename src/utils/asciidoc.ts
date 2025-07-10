import Asciidoctor from "@asciidoctor/core";
import fs from "fs";
import path from "path";
import { decode } from "html-entities";

interface AsciidoctorDocument {
  getSourceLocation(): { getPath(): string };
}

interface AsciidoctorReader {
  pushInclude(
    content: string,
    file: string,
    target: string,
    line: number,
    attributes: Record<string, unknown>
  ): void;
}

interface AsciidoctorAttributes {
  [key: string]: unknown;
}

// Initialize Asciidoctor processor
const asciidoctor = Asciidoctor();

/**
 * Custom Asciidoctor include processor that resolves partials
 */
class CustomIncludeProcessor {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  process(
    doc: AsciidoctorDocument,
    reader: AsciidoctorReader,
    target: string,
    attributes: AsciidoctorAttributes
  ) {
    // Get current file directory to resolve relative includes correctly
    const currentDir = path.dirname(doc.getSourceLocation().getPath());

    let includeFile = target;

    // If target is a relative path, resolve it from current file directory
    if (!path.isAbsolute(target) && !target.startsWith("/")) {
      includeFile = path.resolve(currentDir, target);
    }

    // If not found, try from the content base path
    if (!fs.existsSync(includeFile)) {
      includeFile = path.join(this.basePath, target);
    }

    if (fs.existsSync(includeFile)) {
      const content = fs.readFileSync(includeFile, "utf8");
      return reader.pushInclude(content, includeFile, target, 1, attributes);
    } else {
      console.warn(`Include file not found: ${includeFile}`);
      return reader.pushInclude(
        `[WARNING] Include file not found: ${target}`,
        target,
        target,
        1,
        attributes
      );
    }
  }
}

/**
 * Process AsciiDoc content with proper include resolution
 */
export function processAsciiDoc(
  filePath: string,
  content: string,
  options: Record<string, unknown> = {}
) {
  const basePath = path.dirname(filePath);
  const registry = asciidoctor.Extensions.create();

  // Create an instance of our custom processor
  const customProcessor = new CustomIncludeProcessor(basePath);

  // Try using a simple approach first - just skip extension registration
  // and see if the document still processes correctly
  const skipExtensions = true;

  if (!skipExtensions) {
    // Register include processor using a factory function
    const IncludeProcessor = function () {};
    IncludeProcessor.prototype.handles = function () {
      return true;
    };
    IncludeProcessor.prototype.process = function (
      doc: AsciidoctorDocument,
      reader: AsciidoctorReader,
      target: string,
      attrs: AsciidoctorAttributes
    ) {
      return customProcessor.process(doc, reader, target, attrs);
    };

    registry.includeProcessor(IncludeProcessor);
  }

  // Set default options with proper typing
  const defaultOptions: Record<string, unknown> = {
    safe: "server",
    base_dir: basePath,
    attributes: {
      "source-highlighter": "highlight.js",
      icons: "font",
      sectanchors: "",
      idprefix: "",
      idseparator: "-",
    },
  };

  // Add extension registry only if we're not skipping extensions
  if (!skipExtensions) {
    defaultOptions.extension_registry = registry;
  }

  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };

  // Convert AsciiDoc to HTML - use the processor without extension registration
  // if we're having issues with extensions
  try {
    let html = asciidoctor.convert(content, mergedOptions) as string;
    // Post-process image src paths: replace src="filename.png" with src="/docs/filename.png" if not already absolute or external
    html = html.replace(
      /<img([^>]+)src=["'](?![a-z]+:|\/)([^"'>]+)["']/gi,
      '<img$1src="/docs/$2"'
    );
    return html;
  } catch (error) {
    console.error("Error converting AsciiDoc content:", error);

    // Try without extension registry as fallback
    // Create a new options object without the extension_registry property using destructuring
    // Use object destructuring with "rest" syntax to remove the property
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { extension_registry, ...fallbackOptions } = defaultOptions;
    let html = asciidoctor.convert(content, fallbackOptions) as string;
    html = html.replace(
      /<img([^>]+)src=["'](?![a-z]+:|\/)([^"'>]+)["']/gi,
      '<img$1src="/docs/$2"'
    );
    return html;
  }
}

/**
 * Decode HTML entities in a string
 */
export function decodeHtmlEntities(text: string): string {
  return decode(text);
}

/**
 * Extract metadata from AsciiDoc document
 */
export function extractMetadata(
  filePath: string,
  content: string
): {
  title: string;
  description: string;
  authors: string[];
  attributes: Record<string, unknown>;
} {
  const doc = asciidoctor.load(content, { safe: "server" });

  // Get the title and ensure it's a string
  const docTitle = doc.getDocumentTitle();
  let title =
    typeof docTitle === "string"
      ? docTitle
      : docTitle?.toString() || path.basename(filePath, path.extname(filePath));

  // Decode HTML entities in the title
  title = decodeHtmlEntities(title);

  // Get and decode description if it exists
  const description = doc.hasAttribute("description")
    ? decodeHtmlEntities(String(doc.getAttribute("description")))
    : "";

  return {
    title,
    description,
    authors: doc.hasAttribute("page-authors")
      ? String(doc.getAttribute("page-authors"))
          .split(",")
          .map((author: string) => author.trim())
      : [],
    attributes: doc.getAttributes() as Record<string, unknown>,
  };
}

/**
 * Check if a file exists
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    // Silently handle any errors and return false
    return false;
  }
}

/**
 * Get all available language variants for a given base path
 */
export function getLanguageVariants(
  basePath: string,
  fileName: string
): string[] {
  const dir = path.dirname(basePath);
  const baseFileName = path.basename(fileName, ".adoc");

  // Get all adoc files in the directory
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.startsWith(baseFileName) && file.endsWith(".adoc"));

  // Extract locales from filenames
  return files.map((file) => {
    // Format: index.de.adoc -> de
    const match = file.match(
      new RegExp(`${baseFileName}(?:\\.([\\w-]+))?\\.adoc$`)
    );
    return match && match[1] ? match[1] : "en";
  });
}
