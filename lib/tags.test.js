import { describe, expect, it } from 'vitest'
import { getAllTags } from './tags'
import { getAllFilesFrontMatter } from './mdx'
import kebabCase from './utils/kebabCase'

// getAllTags feeds getStaticPaths for /tags/<slug>. A tag it misses is a 404 on
// a URL that used to work; a tag it invents is a page with no posts behind it.
describe('getAllTags', () => {
  it('slugifies every tag it returns', async () => {
    const tags = Object.keys(await getAllTags('blog'))

    expect(tags.filter((tag) => tag !== kebabCase(tag))).toEqual([])
  })

  it('counts every published post carrying a tag', async () => {
    const tagCount = await getAllTags('blog')
    const posts = await getAllFilesFrontMatter('blog')

    const expected = {}
    posts.forEach((post) => {
      ;(post.tags ?? []).forEach((tag) => {
        const slug = kebabCase(tag)
        expected[slug] = (expected[slug] ?? 0) + 1
      })
    })

    expect(tagCount).toEqual(expected)
  })

  it('never counts a draft', async () => {
    // Implied by the test above, which builds its expectation from the published
    // set only — stated separately because it is the invariant that matters.
    const tagCount = await getAllTags('blog')
    const publishedTags = new Set(
      (await getAllFilesFrontMatter('blog')).flatMap((post) => (post.tags ?? []).map(kebabCase))
    )

    expect(Object.keys(tagCount).filter((tag) => !publishedTags.has(tag))).toEqual([])
  })

  it('returns at least one tag, so the assertions above are not vacuous', async () => {
    expect(Object.keys(await getAllTags('blog')).length).toBeGreaterThan(0)
  })
})
