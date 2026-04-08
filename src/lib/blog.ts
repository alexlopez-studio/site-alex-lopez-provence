import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  category?: string
  author?: string
  published: boolean
  content: string
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    category: data.category,
    author: data.author,
    published: data.published !== false,
    content,
  }
}

export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map(getPostBySlug)
    .filter((p): p is BlogPost => p !== null && p.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}
