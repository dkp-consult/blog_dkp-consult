import { describe, expect, it } from 'vitest'
import { escape } from './htmlEscaper'

describe('escape', () => {
  it('escapes the characters that would break an XML document', () => {
    expect(escape(`& < > " '`)).toBe('&amp; &lt; &gt; &quot; &#39;')
  })

  it('leaves accented characters untouched', () => {
    expect(escape('Déploiement à côté')).toBe('Déploiement à côté')
  })

  it('escapes every occurrence, not just the first one', () => {
    expect(escape('Docker & Coolify & Traefik')).toBe('Docker &amp; Coolify &amp; Traefik')
  })
})
