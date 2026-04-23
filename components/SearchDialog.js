import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from './Link'

const SearchContext = createContext(null)

export const useSearch = () => useContext(SearchContext)

const createIndex = async (entries) => {
  const { Document } = await import('flexsearch')
  const index = new Document({
    document: {
      id: 'slug',
      index: ['title', 'summary', 'tags', 'body'],
      store: ['title', 'summary', 'tags', 'date'],
    },
    tokenize: 'forward',
  })
  for (const entry of entries) index.add(entry)
  return index
}

const mergeResults = (raw) => {
  const seen = new Map()
  for (const field of raw) {
    for (const hit of field.result) {
      if (!seen.has(hit.id)) seen.set(hit.id, hit.doc)
    }
  }
  return Array.from(seen, ([slug, doc]) => ({ slug, ...doc }))
}

const LoupeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
    />
  </svg>
)

export const SearchProvider = ({ children }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const indexRef = useRef(null)
  const inputRef = useRef(null)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setResults([])
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus({ preventScroll: true })
    if (indexRef.current) {
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
    let cancelled = false
    setLoading(true)
    fetch('/search-index.json')
      .then((r) => r.json())
      .then(createIndex)
      .then((index) => {
        if (!cancelled) indexRef.current = index
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  useEffect(() => {
    if (!indexRef.current || !query.trim()) {
      setResults([])
      return
    }
    const raw = indexRef.current.search(query, { enrich: true, limit: 8 })
    setResults(mergeResults(raw))
  }, [query])

  const go = useCallback(
    (slug) => {
      close()
      router.push(`/blog/${slug}`)
    },
    [router, close]
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (results[0]) go(results[0].slug)
  }

  return (
    <SearchContext.Provider value={{ open, setOpen, close }}>
      {children}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Recherche"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[15vh] sm:items-center sm:pt-4"
          onClick={close}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={onSubmit}>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article…"
                className="w-full border-b border-gray-200 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none dark:border-gray-700 dark:text-gray-100"
                autoComplete="off"
              />
            </form>
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                  Chargement de l&apos;index…
                </div>
              )}
              {!loading && query.trim() && results.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                  Aucun résultat.
                </div>
              )}
              {results.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block border-b border-gray-100 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  onClick={close}
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{r.title}</div>
                  {r.summary && (
                    <div className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {r.summary}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </SearchContext.Provider>
  )
}

export const SearchIconButton = () => {
  const { setOpen } = useSearch()
  return (
    <button
      type="button"
      aria-label="Rechercher"
      className="ml-1 mr-1 h-8 w-8 rounded p-1 sm:ml-4"
      onClick={() => setOpen(true)}
    >
      <LoupeIcon className="text-gray-900 dark:text-gray-100" />
    </button>
  )
}

export const SearchBar = ({ placeholder = 'Rechercher un article…' }) => {
  const { setOpen } = useSearch()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group flex w-full max-w-xl items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-gray-500 transition hover:border-primary-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-primary-500 sm:gap-3 sm:px-4 sm:py-3 sm:shadow-sm"
    >
      <LoupeIcon className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
      <span className="flex-1 text-sm sm:text-base">{placeholder}</span>
      <kbd className="hidden rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:inline">
        ⌘K
      </kbd>
    </button>
  )
}
