import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

/**
 * MDX options configuration for next-mdx-remote
 * This adds GitHub Flavored Markdown support (tables, task lists, strikethrough, etc)
 */
export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    // You can add more plugins here if needed
  }
};

type Metadata = {
  title: string
  date: string
  author: string
  description: string
  tags?: string[]
  featuredImage?: string
}

function parseFrontmatter(fileContent: string) {
  // Use gray-matter to parse the frontmatter
  const { data, content } = matter(fileContent)
  
  // Ensure tags is always an array if present
  if (data.tags && !Array.isArray(data.tags)) {
    data.tags = [data.tags]
  }

  return { metadata: data as Metadata, content }
}

type MDXFile = {
  slug: string;
  path: string;
}

function getMDXFiles(dir: string): MDXFile[] {
  const results: MDXFile[] = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const file of files) {
    if (file.isDirectory()) {
      // Check if index.md exists in this directory
      const indexPath = path.join(dir, file.name, 'index.md')
      if (fs.existsSync(indexPath)) {
        results.push({
          slug: file.name,
          path: indexPath
        })
      }
    } else if (file.isFile() && path.extname(file.name) === '.md') {
      // Support direct .md files too for flexibility
      results.push({
        slug: path.basename(file.name, '.md'),
        path: path.join(dir, file.name)
      })
    }
  }
  
  return results
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

// Process markdown content with GitHub Flavored Markdown support
export async function processMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // Parse markdown content
    .use(remarkGfm)   // Add GitHub Flavored Markdown support (tables, strikethrough, task lists, etc.)
    .use(remarkRehype) // Convert to HTML
    .use(rehypeStringify) // Stringify HTML
    .process(content)

  return result.toString()
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(file.path)

    // Parse the date components from date for URL construction
    let urlParts = { year: '', month: '' };
    // Default to current date if date is missing
    const date = metadata.date || new Date().toISOString().slice(0, 10);
    const [year = '', month = ''] = date.split('-');
    urlParts = { year, month };
    
    return {
      metadata,
      slug: file.slug,
      content,
      ...urlParts
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'content', 'blog'))
}
