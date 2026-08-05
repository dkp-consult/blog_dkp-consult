import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './generate-search-index'

// stripMarkdown decides what the full-text search can match. A regex that eats
// too much silently empties the corpus: the build stays green and the search
// goes quiet.
describe('stripMarkdown', () => {
  it('keeps the prose and drops the heading markers', () => {
    expect(stripMarkdown('# Titre\n\nDu texte.')).toBe('Titre Du texte.')
  })

  it('drops fenced code blocks entirely', () => {
    expect(stripMarkdown('Avant\n\n```js\nconst secret = 1\n```\n\nAprès')).toBe('Avant Après')
  })

  it('drops inline code', () => {
    expect(stripMarkdown('Lance `npm run build` ensuite')).toBe('Lance ensuite')
  })

  it('keeps the link text and drops the URL', () => {
    expect(stripMarkdown('Voir [la doc](https://example.com/page) pour la suite')).toBe(
      'Voir la doc pour la suite'
    )
  })

  it('drops images, alt text included', () => {
    expect(stripMarkdown('Avant ![un renard](/static/images/fox.webp) après')).toBe('Avant après')
  })

  it('drops HTML tags but keeps their content', () => {
    expect(stripMarkdown('Un <strong>mot</strong> important')).toBe('Un mot important')
  })

  it('drops emphasis markers without touching the words', () => {
    expect(stripMarkdown('Du **gras**, de l_italique_ et du ~~barré~~')).toBe(
      'Du gras, de litalique et du barré'
    )
  })

  it('drops import and export lines from MDX', () => {
    expect(stripMarkdown("import Foo from './foo'\n\nDu texte.")).toBe('Du texte.')
  })

  it('collapses whitespace and trims', () => {
    expect(stripMarkdown('  Un   texte\n\n\navec des blancs  ')).toBe('Un texte avec des blancs')
  })

  it('preserves accented characters', () => {
    expect(stripMarkdown('Développement à Liège')).toBe('Développement à Liège')
  })
})
