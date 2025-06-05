import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
  
  // Handle mapping of date to publishedAt for compatibility
  if (data.date && !data.publishedAt) {
    data.publishedAt = data.date
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
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(file.path)
    
    // Parse the date components from publishedAt for URL construction
    let urlParts = { year: '', month: '' };
    // Default to current date if date is missing
    const date = metadata.date || new Date().toISOString().slice(0, 10);
    const [year, month] = date.split('-');
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

export function formatDate(date: string = '', includeRelative = false) {
  let targetDate = date ? new Date(date) : new Date();
  return targetDate.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });
}
