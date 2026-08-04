import { describe, expect, it } from 'vitest'
import { dateSortDesc, formatSlug } from './mdx'

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
