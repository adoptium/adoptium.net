import { describe, it, expect, vi, beforeEach } from "vitest";

const fsMocks = vi.hoisted(() => ({
  readdirSync: vi.fn(),
  existsSync: vi.fn(),
  statSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock("fs", () => ({
  ...fsMocks,
  default: fsMocks,
}));

import * as fs from "fs";
import { getAppRoutes, getBlogRoutes } from "../getAppRoutes";

// Alias for consistency
const mockedFs = fsMocks;

function createMockDirent(name: string, isDir: boolean): fs.Dirent {
  return {
    name,
    isDirectory: () => isDir,
    isFile: () => !isDir,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
  } as unknown as fs.Dirent;
}

describe("getAppRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correct routes ignoring __tests__ folders", () => {
    mockedFs.readdirSync.mockImplementation((dir: string, opts: any) => {
      if (opts?.withFileTypes) {
        if (dir.endsWith("[locale]")) {
          return [
            createMockDirent("adopters", true),
            createMockDirent("__tests__", true),
          ];
        }
        if (dir.endsWith("adopters")) {
          return [createMockDirent("page.tsx", false)];
        }
      }
      return [];
    });

    const routes = getAppRoutes();
    expect(routes).toEqual(["/adopters"]);
  });
});

describe("getBlogRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedFs.readdirSync.mockImplementation((dir: string, opts: any) => {
      if (opts?.withFileTypes) {
        if (
          dir.includes("blog") &&
          !dir.includes("blog1") &&
          !dir.includes("blog2") &&
          !dir.includes("blog3")
        ) {
          return [
            createMockDirent("blog1", true),
            createMockDirent("blog2", true),
            createMockDirent("blog3", true),
            createMockDirent("notafolder", false),
          ];
        }
        if (dir.includes("blog1")) return [createMockDirent("index.md", false)];
        if (dir.includes("blog2")) return [createMockDirent("index.md", false)];
        if (dir.includes("blog3")) return [];
      }
      return [];
    });

    mockedFs.existsSync.mockImplementation(
      (p: string) =>
        p.includes("blog1/index.md") || p.includes("blog2/index.md")
    );

    mockedFs.statSync.mockImplementation((p: string) => {
      if (p.includes("blog1/index.md")) {
        return { mtime: new Date("2024-05-20") } as fs.Stats;
      }
      if (p.includes("blog2/index.md")) {
        return { mtime: new Date("2024-06-26") } as fs.Stats;
      }
      throw new Error("File not found");
    });

    mockedFs.readFileSync.mockImplementation((p: string) => {
      if (p.includes("blog1/index.md")) {
        return `---\ndate: 2025-05-09\n---\nBlog 1 content`;
      }
      if (p.includes("blog2/index.md")) {
        return `---\ndate: 2024-06-26\n---\nBlog 2 content`;
      }
      return "";
    });
  });

  it("returns blog routes with lastmod from index.md", () => {
    const routes = getBlogRoutes();
    expect(routes).toEqual([
      { loc: "/news/2025/05/blog1/", lastmod: "2024-05-20" },
      { loc: "/news/2024/06/blog2/", lastmod: "2024-06-26" },
    ]);
  });

  it("returns blog routes with lastmod from index.md missing", () => {
    mockedFs.existsSync.mockImplementation((p: string) =>
      p.includes("blog2/index.md")
    );
    const routes = getBlogRoutes();
    expect(routes).toEqual([
      { loc: "/news/2024/06/blog2/", lastmod: "2024-06-26" },
    ]);
  });

  it("skips folders without index.md", () => {
    mockedFs.existsSync.mockReturnValue(false);
    const routes = getBlogRoutes();
    expect(routes).toEqual([]);
  });
});
