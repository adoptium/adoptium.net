import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import fs from "fs";
import path from "path";
import {
  getAsciidocContent,
  getAllAsciidocPaths,
  getPagesInSection,
} from "../asciidocService";

// Mock the filesystem
vi.mock("fs");
const mockFs = vi.mocked(fs) as {
  readFileSync: Mock;
  readdirSync: Mock;
};

// Ensure the mocked fs functions are actual mocks with mockReturnValue, etc.
if (!mockFs.readFileSync.mockReturnValue) {
  mockFs.readFileSync = vi.fn() as Mock;
}
if (!mockFs.readdirSync.mockReturnValue) {
  mockFs.readdirSync = vi.fn() as Mock;
}

// Mock the asciidoc utils
vi.mock("@/utils/asciidoc", () => ({
  processAsciiDoc: vi.fn(),
  extractMetadata: vi.fn(),
  getLanguageVariants: vi.fn(),
  fileExists: vi.fn(),
}));

// Import the mocked utilities
import {
  processAsciiDoc,
  extractMetadata,
  getLanguageVariants,
  fileExists,
} from "@/utils/asciidoc";
const mockProcessAsciiDoc = vi.mocked(processAsciiDoc);
const mockExtractMetadata = vi.mocked(extractMetadata);
const mockGetLanguageVariants = vi.mocked(getLanguageVariants);
const mockFileExists = vi.mocked(fileExists);

// Type for fs.Dirent mock objects
interface MockDirent {
  name: string;
  isDirectory: () => boolean;
  isFile: () => boolean;
}

describe("asciidocService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getAsciidocContent", () => {
    const mockContent = `= Test Page
:description: Test description

This is test content.`;

    const mockMetadata = {
      title: "Test Page",
      description: "Test description",
      authors: ["Test Author"],
      attributes: { layout: "default" },
    };

    it("should get content for a simple slug with default locale", async () => {
      const slug = "about";
      const expectedPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/about/index.en.adoc"
      );
      const fallbackPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/about/index.adoc"
      );

      mockFileExists.mockReturnValueOnce(false).mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValue(mockContent);
      mockProcessAsciiDoc.mockReturnValue("<p>This is test content.</p>");
      mockExtractMetadata.mockReturnValue(mockMetadata);
      mockGetLanguageVariants.mockReturnValue(["en", "zh-CN"]);

      const result = await getAsciidocContent(slug);

      expect(mockFileExists).toHaveBeenCalledWith(expectedPath);
      expect(mockFileExists).toHaveBeenCalledWith(fallbackPath);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(fallbackPath, "utf8");
      expect(mockProcessAsciiDoc).toHaveBeenCalledWith(
        fallbackPath,
        mockContent
      );
      expect(mockExtractMetadata).toHaveBeenCalledWith(
        fallbackPath,
        mockContent
      );
      expect(mockGetLanguageVariants).toHaveBeenCalledWith(
        fallbackPath,
        "index"
      );

      expect(result).toEqual({
        content: "<p>This is test content.</p>",
        metadata: mockMetadata,
        path: fallbackPath,
        slug: "about",
        locale: "en",
        availableLocales: ["en", "zh-CN"],
      });
    });

    it("should get content for a specific locale", async () => {
      const slug = "about";
      const locale = "zh-CN";
      const expectedPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/about/index.zh-CN.adoc"
      );

      mockFileExists.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(mockContent);
      mockProcessAsciiDoc.mockReturnValue("<p>This is test content.</p>");
      mockExtractMetadata.mockReturnValue(mockMetadata);
      mockGetLanguageVariants.mockReturnValue(["en", "zh-CN"]);

      const result = await getAsciidocContent(slug, locale);

      expect(mockFileExists).toHaveBeenCalledWith(expectedPath);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(expectedPath, "utf8");
      expect(result?.locale).toBe("zh-CN");
    });

    it("should handle nested slugs", async () => {
      const slug = "docs/installation/guide";
      const expectedPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/docs/installation/guide/index.en.adoc"
      );
      const fallbackPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/docs/installation/guide/index.adoc"
      );

      mockFileExists.mockReturnValueOnce(false).mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValue(mockContent);
      mockProcessAsciiDoc.mockReturnValue("<p>This is test content.</p>");
      mockExtractMetadata.mockReturnValue(mockMetadata);
      mockGetLanguageVariants.mockReturnValue(["en"]);

      const result = await getAsciidocContent(slug);

      expect(mockFileExists).toHaveBeenCalledWith(expectedPath);
      expect(mockFileExists).toHaveBeenCalledWith(fallbackPath);
      expect(result?.slug).toBe("docs/installation/guide");
    });

    it("should return null when neither locale-specific nor default file exists", async () => {
      const slug = "nonexistent";

      mockFileExists.mockReturnValue(false);

      const result = await getAsciidocContent(slug);

      expect(result).toBeNull();
    });

    it("should handle file reading errors gracefully", async () => {
      const slug = "about";
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFileExists.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error("File read error");
      });

      const result = await getAsciidocContent(slug);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error processing AsciiDoc file"),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should handle processing errors gracefully", async () => {
      const slug = "about";
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFileExists.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(mockContent);
      mockProcessAsciiDoc.mockImplementation(() => {
        throw new Error("Processing error");
      });

      const result = await getAsciidocContent(slug);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should filter empty slug parts", async () => {
      const slug = "/docs//installation/";
      const expectedPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/docs/installation/index.en.adoc"
      );

      mockFileExists.mockReturnValueOnce(false).mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValue(mockContent);
      mockProcessAsciiDoc.mockReturnValue("<p>Content</p>");
      mockExtractMetadata.mockReturnValue(mockMetadata);
      mockGetLanguageVariants.mockReturnValue(["en"]);

      await getAsciidocContent(slug);

      expect(mockFileExists).toHaveBeenCalledWith(expectedPath);
    });

    it("should handle empty slug", async () => {
      const slug = "";
      const expectedPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/index.en.adoc"
      );

      mockFileExists.mockReturnValueOnce(false).mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValue(mockContent);
      mockProcessAsciiDoc.mockReturnValue("<p>Content</p>");
      mockExtractMetadata.mockReturnValue(mockMetadata);
      mockGetLanguageVariants.mockReturnValue(["en"]);

      await getAsciidocContent(slug);

      expect(mockFileExists).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe("getAllAsciidocPaths", () => {
    it("should traverse directories and find all AsciiDoc files", async () => {
      const mockDirEntries: MockDirent[] = [
        { name: "about", isDirectory: () => true, isFile: () => false },
        { name: "docs", isDirectory: () => true, isFile: () => false },
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        { name: "README.md", isDirectory: () => false, isFile: () => true },
      ];

      const mockAboutEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        {
          name: "index.zh-CN.adoc",
          isDirectory: () => false,
          isFile: () => true,
        },
      ];

      const mockDocsEntries: MockDirent[] = [
        { name: "installation", isDirectory: () => true, isFile: () => false },
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
      ];

      const mockInstallationEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        { name: "index.es.adoc", isDirectory: () => false, isFile: () => true },
      ];

      (mockFs.readdirSync as unknown as Mock)
        .mockReturnValueOnce(mockDirEntries)
        .mockReturnValueOnce(mockAboutEntries)
        .mockReturnValueOnce(mockDocsEntries)
        .mockReturnValueOnce(mockInstallationEntries);

      const result = await getAllAsciidocPaths();

      expect(result).toEqual([
        { slug: "about", locale: "en" },
        { slug: "about", locale: "zh-CN" },
        { slug: "docs/installation", locale: "en" },
        { slug: "docs/installation", locale: "es" },
        { slug: "docs", locale: "en" },
        { slug: "", locale: "en" }, // Root index.adoc
      ]);
    });

    it("should skip _partials directories", async () => {
      const mockDirEntries: MockDirent[] = [
        { name: "about", isDirectory: () => true, isFile: () => false },
        { name: "_partials", isDirectory: () => true, isFile: () => false },
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
      ];

      const mockAboutEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
      ];

      (mockFs.readdirSync as unknown as Mock)
        .mockReturnValueOnce(mockDirEntries)
        .mockReturnValueOnce(mockAboutEntries);

      const result = await getAllAsciidocPaths();

      expect(result).toEqual([
        { slug: "about", locale: "en" },
        { slug: "", locale: "en" },
      ]);

      // Verify _partials directory was not traversed
      expect(mockFs.readdirSync).toHaveBeenCalledTimes(2);
    });

    it("should handle complex locale patterns", async () => {
      const mockDirEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        {
          name: "index.en-US.adoc",
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: "index.pt-BR.adoc",
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: "index.zh_CN.adoc",
          isDirectory: () => false,
          isFile: () => true,
        },
        { name: "other.adoc", isDirectory: () => false, isFile: () => true },
      ];

      (mockFs.readdirSync as unknown as Mock).mockReturnValueOnce(
        mockDirEntries
      );

      const result = await getAllAsciidocPaths();

      expect(result).toEqual([
        { slug: "", locale: "en" },
        { slug: "", locale: "en-US" },
        { slug: "", locale: "pt-BR" },
        { slug: "", locale: "zh_CN" },
      ]);
    });

    it("should handle empty directories", async () => {
      mockFs.readdirSync.mockReturnValue([]);

      const result = await getAllAsciidocPaths();

      expect(result).toEqual([]);
    });

    it("should handle filesystem errors gracefully", async () => {
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });

      await expect(getAllAsciidocPaths()).rejects.toThrow("Permission denied");
    });
  });

  describe("getPagesInSection", () => {
    it("should filter pages in a specific section with preferred locale", async () => {
      // Since we can't easily mock the internal call to getAllAsciidocPaths,
      // let's mock the filesystem to return the structure we need
      const createMockFileSystem = () => {
        const mockEntries: MockDirent[] = [
          { name: "docs", isDirectory: () => true, isFile: () => false },
          { name: "about", isDirectory: () => true, isFile: () => false },
          { name: "support", isDirectory: () => true, isFile: () => false },
        ];

        const mockDocsEntries: MockDirent[] = [
          { name: "index.adoc", isDirectory: () => false, isFile: () => true },
          {
            name: "installation",
            isDirectory: () => true,
            isFile: () => false,
          },
          {
            name: "configuration",
            isDirectory: () => true,
            isFile: () => false,
          },
          { name: "guides", isDirectory: () => true, isFile: () => false },
        ];

        const mockInstallationEntries: MockDirent[] = [
          { name: "index.adoc", isDirectory: () => false, isFile: () => true },
          {
            name: "index.es.adoc",
            isDirectory: () => false,
            isFile: () => true,
          },
        ];

        const mockConfigurationEntries: MockDirent[] = [
          { name: "index.adoc", isDirectory: () => false, isFile: () => true },
          {
            name: "index.fr.adoc",
            isDirectory: () => false,
            isFile: () => true,
          },
        ];

        const mockGuidesEntries: MockDirent[] = [
          { name: "setup", isDirectory: () => true, isFile: () => false },
        ];

        const mockSetupEntries: MockDirent[] = [
          { name: "index.adoc", isDirectory: () => false, isFile: () => true },
          {
            name: "index.es.adoc",
            isDirectory: () => false,
            isFile: () => true,
          },
        ];

        const mockAboutEntries: MockDirent[] = [
          { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        ];

        const mockSupportEntries: MockDirent[] = [
          { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        ];

        let callCount = 0;
        (mockFs.readdirSync as unknown as Mock).mockImplementation(() => {
          switch (callCount++) {
            case 0:
              return mockEntries;
            case 1:
              return mockDocsEntries;
            case 2:
              return mockInstallationEntries;
            case 3:
              return mockConfigurationEntries;
            case 4:
              return mockGuidesEntries;
            case 5:
              return mockSetupEntries;
            case 6:
              return mockAboutEntries;
            case 7:
              return mockSupportEntries;
            default:
              return [];
          }
        });
      };

      createMockFileSystem();

      const result = await getPagesInSection("docs", "es");

      // Should include pages that start with 'docs' but are not 'docs' itself
      // and prefer 'es' locale but include 'en' as fallback
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (page) => page.slug.startsWith("docs") && page.slug !== "docs"
        )
      ).toBe(true);
    });

    it("should return empty array for non-existent section", async () => {
      (mockFs.readdirSync as unknown as Mock).mockReturnValue([]);

      const result = await getPagesInSection("nonexistent");

      expect(result).toEqual([]);
    });

    it("should handle default locale fallback", async () => {
      const mockEntries: MockDirent[] = [
        { name: "docs", isDirectory: () => true, isFile: () => false },
      ];

      const mockDocsEntries: MockDirent[] = [
        { name: "test", isDirectory: () => true, isFile: () => false },
      ];

      const mockTestEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
      ];

      (mockFs.readdirSync as unknown as Mock)
        .mockReturnValueOnce(mockEntries)
        .mockReturnValueOnce(mockDocsEntries)
        .mockReturnValueOnce(mockTestEntries);

      const result = await getPagesInSection("docs", "fr");

      // Should include English fallback when French is not available
      expect(result.some((page) => page.locale === "en")).toBe(true);
    });

    it("should exclude the section itself from results", async () => {
      const mockEntries: MockDirent[] = [
        { name: "docs", isDirectory: () => true, isFile: () => false },
      ];

      const mockDocsEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        { name: "subpage", isDirectory: () => true, isFile: () => false },
      ];

      const mockSubpageEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
      ];

      (mockFs.readdirSync as unknown as Mock)
        .mockReturnValueOnce(mockEntries)
        .mockReturnValueOnce(mockDocsEntries)
        .mockReturnValueOnce(mockSubpageEntries);

      const result = await getPagesInSection("docs");

      // Should not include 'docs' itself, only 'docs/subpage'
      expect(result.every((page) => page.slug !== "docs")).toBe(true);
      expect(result.some((page) => page.slug === "docs/subpage")).toBe(true);
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle malformed file names gracefully", async () => {
      const mockEntries: MockDirent[] = [
        { name: "index.adoc", isDirectory: () => false, isFile: () => true },
        {
          name: "malformed.file.name.adoc",
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: "index.invalid-locale.adoc",
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: "not-index.adoc",
          isDirectory: () => false,
          isFile: () => true,
        },
      ];

      (mockFs.readdirSync as unknown as Mock).mockReturnValue(mockEntries);

      const result = await getAllAsciidocPaths();

      // Should only include properly formatted index files
      expect(result).toEqual([
        { slug: "", locale: "en" },
        { slug: "", locale: "invalid-locale" },
      ]);
    });

    it("should handle very deep directory structures", async () => {
      const slug = "very/deep/nested/path/structure";
      const expectedPath = path.join(
        process.cwd(),
        "content/asciidoc-pages/very/deep/nested/path/structure/index.en.adoc"
      );

      mockFileExists.mockReturnValueOnce(false).mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValue("= Deep Content");
      mockProcessAsciiDoc.mockReturnValue("<p>Deep content</p>");
      mockExtractMetadata.mockReturnValue({
        title: "Deep Content",
        description: "",
        authors: [],
        attributes: {},
      });
      mockGetLanguageVariants.mockReturnValue(["en"]);

      const result = await getAsciidocContent(slug);

      expect(result?.slug).toBe(slug);
      expect(mockFileExists).toHaveBeenCalledWith(expectedPath);
    });

    it("should handle special characters in slugs", async () => {
      const slug = "special-chars_and.dots";

      mockFileExists.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("= Special Content");
      mockProcessAsciiDoc.mockReturnValue("<p>Special content</p>");
      mockExtractMetadata.mockReturnValue({
        title: "Special Content",
        description: "",
        authors: [],
        attributes: {},
      });
      mockGetLanguageVariants.mockReturnValue(["en"]);

      const result = await getAsciidocContent(slug);

      expect(result?.slug).toBe(slug);
    });
  });
});
