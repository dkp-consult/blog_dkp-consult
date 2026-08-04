import { describe, expect, it } from 'vitest'
import kebabCase from './kebabCase'

// Tag slugs are URL segments (/tags/<slug>) and are indexed by search engines,
// so these cases pin down the current shape of live URLs rather than an ideal one.
// Note: accents are kept, not transliterated — /tags/productivité is a real route.
describe('kebabCase', () => {
  it('keeps accents and only lowercases them', () => {
    expect(kebabCase('Productivité')).toBe('productivité')
  })

  it('maps two casings of the same tag onto a single slug', () => {
    expect(kebabCase('Productivité')).toBe(kebabCase('productivité'))
  })

  it('joins multiple words with a single dash', () => {
    expect(kebabCase('user case')).toBe('user-case')
  })

  it('is idempotent on an already slugified tag', () => {
    expect(kebabCase('écologie-numérique')).toBe('écologie-numérique')
  })
})
