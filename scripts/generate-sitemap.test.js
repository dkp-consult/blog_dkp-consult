import { describe, expect, it } from 'vitest'
import { pageToRoute } from './generate-sitemap'

// The sitemap is what search engines crawl. A route wrongly dropped removes an
// indexed page; a route wrongly kept advertises a 404. Neither fails the build.
describe('pageToRoute', () => {
  describe('exclusions', () => {
    it('drops a draft post', () => {
      expect(pageToRoute('data/blog/tips/brouillon.md', { draft: true })).toBeNull()
    })

    it('drops a post that declares its canonical URL elsewhere', () => {
      expect(
        pageToRoute('data/blog/tips/repris.md', { canonicalUrl: 'https://example.com/ailleurs' })
      ).toBeNull()
    })

    it('drops the 404 page', () => {
      expect(pageToRoute('pages/404.js')).toBeNull()
    })

    it('drops the catch-all route', () => {
      expect(pageToRoute('pages/blog/[...slug].js')).toBeNull()
    })

    it('keeps a published post', () => {
      expect(pageToRoute('data/blog/tips/publie.md', { draft: false })).toBe('/blog/tips/publie')
    })

    it('only reads draft and canonicalUrl on markdown sources', () => {
      // A frontmatter-looking object on a non-markdown page must not exclude it.
      expect(pageToRoute('pages/projects.js', { draft: true })).toBe('/projects')
    })
  })

  describe('path to route', () => {
    it('maps the home page to the site root', () => {
      expect(pageToRoute('pages/index.js')).toBe('')
    })

    it('maps a top-level page', () => {
      expect(pageToRoute('pages/a-propos.js')).toBe('/a-propos')
    })

    it('maps a nested post, keeping its category segment', () => {
      expect(pageToRoute('data/blog/liberte-code-source/lcs-2025.md')).toBe(
        '/blog/liberte-code-source/lcs-2025'
      )
    })

    it('maps an .mdx post like an .md one', () => {
      expect(pageToRoute('data/blog/tips/article.mdx')).toBe('/blog/tips/article')
    })

    it('maps a tag feed to the tag page, dropping /feed.xml', () => {
      expect(pageToRoute('public/tags/cloud/feed.xml')).toBe('/tags/cloud')
    })

    it('keeps accented tag slugs intact', () => {
      expect(pageToRoute('public/tags/productivité/feed.xml')).toBe('/tags/productivité')
    })
  })
})
