import { describe, it, expect, beforeAll, vi, Mock } from "vitest";
import sitemap from "../sitemap";
import * as getAppRoutesModule from "@/utils/getAppRoutes";
import * as getBlogRoutesModule from "@/utils/getAppRoutes";

vi.mock("@/utils/getAppRoutes");
vi.mock("next/navigation", () => ({}));
vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: () => null,
    redirect: () => {},
    usePathname: () => "",
    useRouter: () => ({}),
  }),
}));

const mockAppRoutes = ["/", "/page-1", "/page-2"];
const mockBlogRoutes = [
  { loc: "/news/2025/05/post-1", lastmod: "2025-05-09" },
  { loc: "/news/2024/12/other-post/", lastmod: "2024-12-01" },
];

describe("sitemap", () => {
  beforeAll(() => {
    (getAppRoutesModule.getAppRoutes as Mock).mockReturnValue(mockAppRoutes);
    (getBlogRoutesModule.getBlogRoutes as Mock).mockReturnValue(mockBlogRoutes);

    // Mock fs for asciidoc structure
    vi.mock("fs", () => {
      const files: Record<string, string[]> = {
        "/Users/foo/adoptium.net-next/content/asciidoc-pages": [
          "about",
          "docs",
        ],
        "/Users/foo/adoptium.net-next/content/asciidoc-pages/about": [
          "index.adoc",
          "index.de.adoc",
        ],
        "/Users/foo/adoptium.net-next/content/asciidoc-pages/docs": [
          "installation.adoc",
        ],
      };
      return {
        readdirSync: (dir: string) => files[dir] || [],
        existsSync: (path: string) => {
          // All files and dirs above exist
          return (
            Object.keys(files).includes(path) ||
            Object.values(files).some((arr) =>
              arr.includes(path.split("/").pop()!)
            )
          );
        },
        statSync: (path: string) => ({
          isDirectory: () => Object.keys(files).includes(path),
        }),
        readFileSync: (path: string) => {
          // Return fake frontmatter for blog/asciidoc if needed
          if (path.endsWith("installation.adoc")) {
            return "---\ntitle: Installation\n---\nContent";
          }
          if (path.endsWith("index.adoc")) {
            return "---\ntitle: About\n---\nContent";
          }
          if (path.endsWith("index.de.adoc")) {
            return "---\ntitle: Über\n---\nContent";
          }
          return "";
        },
      };
    });
  });

  it("generates the expected sitemap snapshot", () => {
    const result = sitemap();
    expect(result).toMatchSnapshot();
  });
});
