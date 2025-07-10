import fs from "fs";
import path from "path";
import matter from "gray-matter";

const LOCALE_DIR = path.join(process.cwd(), "src", "app", "[locale]");
const IGNORED_FOLDERS = ["__tests__"];

export function getAppRoutes(): string[] {
  const routes: string[] = [];

  function walk(dir: string, basePath = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const currentPath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_FOLDERS.includes(entry.name)) continue;
        walk(fullPath, currentPath);
      }

      if (entry.name === "page.tsx") {
        let route =
          "/" +
          basePath
            .replace(/\/page\.tsx$/, "")
            .replace(/\/index$/, "")
            .replace(/\\/g, "/"); // Windows safety

        if (route === "/index" || route === "/") {
          route = "/";
        }

        routes.push(route);
      }
    }
  }

  walk(LOCALE_DIR);

  return routes;
}

interface BlogRoute {
  loc: string;
  lastmod: string;
}

export function getBlogRoutes(): BlogRoute[] {
  const blogDir = path.join(process.cwd(), "content", "blog");
  const folders = fs.readdirSync(blogDir, { withFileTypes: true });

  const routes: BlogRoute[] = [];

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;

    const slug = folder.name;
    const indexPathMd = path.join(blogDir, slug, "index.md");
    const indexPathAdoc = path.join(blogDir, slug, "index.adoc");

    let indexPath = "";
    if (fs.existsSync(indexPathMd)) {
      indexPath = indexPathMd;
    } else if (fs.existsSync(indexPathAdoc)) {
      indexPath = indexPathAdoc;
    } else {
      continue;
    }

    // Read date from frontmatter
    let year = "";
    let month = "";
    try {
      const file = fs.readFileSync(indexPath, "utf8");
      const fm = matter(file);
      if (fm.data && fm.data.date) {
        const d = new Date(fm.data.date);
        year = d.getUTCFullYear().toString();
        month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      }
    } catch {}
    if (!year || !month) continue;

    const stats = fs.statSync(indexPath);
    const lastmod = stats.mtime.toISOString().split("T")[0];

    routes.push({
      loc: `/news/${year}/${month}/${slug}/`,
      lastmod,
    });
  }

  return routes;
}
