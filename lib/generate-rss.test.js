import { describe, expect, it } from 'vitest'
import generateRss from './generate-rss'
import siteMetadata from '@/data/siteMetadata'

const posts = [
  {
    slug: 'cloud/quitter-vercel',
    title: 'Docker & Coolify',
    summary: 'Sortir de Vercel sans <casser> le flux',
    date: '2026-08-04',
    tags: ['docker', 'infra'],
  },
  {
    slug: 'divers/un-autre-article',
    title: 'Un autre article',
    summary: 'Résumé',
    date: '2025-03-15',
    tags: ['divers'],
  },
]

describe('generateRss', () => {
  it('emits one item per post', () => {
    expect(generateRss(posts).match(/<item>/g)).toHaveLength(posts.length)
  })

  it('escapes XML-significant characters coming from the frontmatter', () => {
    const feed = generateRss(posts)

    expect(feed).toContain('<title>Docker &amp; Coolify</title>')
    expect(feed).toContain('Sortir de Vercel sans &lt;casser&gt; le flux')
    expect(feed).not.toContain('<title>Docker & Coolify</title>')
  })

  it('builds absolute links from siteUrl', () => {
    expect(generateRss(posts)).toContain(
      `<link>${siteMetadata.siteUrl}/blog/cloud/quitter-vercel</link>`
    )
  })

  it('points the atom self link at the requested feed page', () => {
    expect(generateRss(posts, 'tags/docker/feed.xml')).toContain(
      `href="${siteMetadata.siteUrl}/tags/docker/feed.xml"`
    )
  })
})
