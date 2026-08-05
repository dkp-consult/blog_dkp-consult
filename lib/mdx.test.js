import { describe, expect, it } from 'vitest'
import matter from 'gray-matter'
import fs from 'fs'
import { dateSortDesc, formatSlug, getAllFilesFrontMatter, getFiles } from './mdx'

describe('formatSlug', () => {
  it('drops the .md extension', () => {
    expect(formatSlug('mon-article.md')).toBe('mon-article')
  })

  it('drops the .mdx extension', () => {
    expect(formatSlug('mon-article.mdx')).toBe('mon-article')
  })

  it('keeps the nested directory that becomes a URL segment', () => {
    expect(formatSlug('cloud/quitter-vercel.md')).toBe('cloud/quitter-vercel')
  })
})

describe('dateSortDesc', () => {
  it('sorts the most recent date first', () => {
    const dates = ['2024-01-01', '2026-08-04', '2025-03-15']
    expect([...dates].sort(dateSortDesc)).toEqual(['2026-08-04', '2025-03-15', '2024-01-01'])
  })

  it('treats equal dates as ties', () => {
    expect(dateSortDesc('2026-08-04', '2026-08-04')).toBe(0)
  })
})

// Runs against the real data/blog corpus rather than fixtures: what matters is
// that no draft ever reaches the published set, whatever the content becomes.
describe('getAllFilesFrontMatter', () => {
  it('excludes drafts from the published set', async () => {
    const posts = await getAllFilesFrontMatter('blog')

    expect(posts.filter((post) => post.draft === true)).toEqual([])
  })

  it('has drafts to exclude in the first place', () => {
    // Without this, the assertion above would pass on an empty filter.
    const drafts = getFiles('blog').filter((file) => {
      const source = fs.readFileSync(`${process.cwd()}/data/blog/${file}`, 'utf8')
      return matter(source).data.draft === true
    })

    expect(drafts.length).toBeGreaterThan(0)
  })

  it('publishes every non-draft file, and only those', async () => {
    const published = getFiles('blog').filter((file) => {
      const source = fs.readFileSync(`${process.cwd()}/data/blog/${file}`, 'utf8')
      return matter(source).data.draft !== true
    })

    expect(await getAllFilesFrontMatter('blog')).toHaveLength(published.length)
  })
})
