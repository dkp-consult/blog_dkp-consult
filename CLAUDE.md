# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal blog of Pierre Debski (dkp-consult), written in French (`fr-be`). Forked from [`timlrx/tailwind-nextjs-starter-blog`](https://github.com/timlrx/tailwind-nextjs-starter-blog) — upstream README is preserved as-is. Site config lives in `data/siteMetadata.js`.

## Commands

- `npm run dev` — Next dev server. MDX edits under `data/` are picked up on next page load (Next dev re-runs `getStaticProps` per request).
- `npm run build` — `next build` followed by `node scripts/generate-sitemap.js`. The sitemap script reads `public/` + `data/blog/**` and writes `public/sitemap.xml`, so build output depends on blog frontmatter (`draft: true` is excluded).
- `npm run serve` — `next start` against the production build.
- `npm run lint` — `next lint --fix` scoped to `pages`, `components`, `lib`, `layouts`, `scripts` (matches `next.config.js` `eslint.dirs`). Husky + lint-staged also run `eslint --fix` and `prettier --write` on staged files.
- `npm run test` — Vitest, single run (`vitest run`). `npm run test:watch` for the interactive mode. Config in `vitest.config.mjs`: `node` environment, path aliases mirrored from `jsconfig.json`, and only `*.test.js` files under `lib`, `scripts`, `components`, `layouts`, `pages` are collected. Tests are colocated with the code they cover and import `describe`/`it`/`expect` from `vitest` explicitly — globals are deliberately not enabled, so no ESLint globals declaration is needed.
- `npm run check` — full gate: `lint` → `test` → `build`. Note it runs `next lint --fix`, so it may rewrite files. There is no typecheck step (pure JS) and no `format` script.
- `npm run analyze` — production build with `@next/bundle-analyzer`.
- `node scripts/compose.js` — interactive prompt to scaffold a new post in `data/blog/` with pre-filled frontmatter.

Node `>=22` is required (see `engines`). Test coverage is intentionally thin: it pins the invariants behind build-time artifacts (RSS escaping, slug shape, post ordering), not the UI.

## Architecture

**Pages Router (not App Router).** All routes live in `pages/`. Blog posts are served by the catch-all `pages/blog/[...slug].js`, which means a post at `data/blog/<category>/<slug>.md` is reachable at `/blog/<category>/<slug>`. Nested directories under `data/blog/` become URL segments — there is no explicit category routing.

**Content pipeline (`lib/mdx.js`).** Content is plain `.md`/`.mdx` files in `data/`. `getFileBySlug` bundles MDX via `mdx-bundler` (esbuild under the hood) with a fixed remark/rehype chain: `remarkGfm`, `remarkFootnotes`, `remarkMath`, custom `remark-code-title` / `remark-toc-headings` / `remark-img-to-jsx` / `remark-extract-frontmatter`, then `rehypeSlug`, `rehypeAutolinkHeadings`, `rehypeKatex`, `rehypeCitation` (reads from `data/`), `rehypePrismPlus`, `rehypePresetMinify`. When adding a plugin, edit this file — the chain isn't configurable externally. `getAllFilesFrontMatter` filters out `draft: true` posts.

**Frontmatter-driven layouts.** Each post's `layout:` frontmatter names a file in `layouts/` (`PostLayout`, `PostSimple`, `ListLayout`, `AuthorLayout`). `components/MDXComponents.js` `require`s the layout dynamically at render time, so a new layout must be a default export in `layouts/` and referenced by exact filename. Default is `PostLayout` (set in `pages/blog/[...slug].js`).

**RSS as a build side-effect.** `pages/blog/[...slug].js` `getStaticProps` writes `public/feed.xml` via `lib/generate-rss.js` during static generation. There is no separate feed script — it's regenerated every build.

**Preact swap in production.** `next.config.js` webpack override aliases `react`/`react-dom` to `preact/compat` for client production bundles only (not dev, not SSR). Any React API that isn't Preact-compatible will build fine but break at runtime in prod — test prod builds when using less-common React features.

**Content Security Policy.** `next.config.js` sets a strict CSP in response headers. Adding analytics, embeds, or third-party scripts requires editing `ContentSecurityPolicy` there (the `siteMetadata.analytics` and `siteMetadata.comment` objects are currently empty; the newsletter feature has been removed from this fork).

## Conventions

- Path aliases (from `jsconfig.json`): `@/components/*`, `@/data/*`, `@/layouts/*`, `@/lib/*`, `@/css/*`. Use these in imports instead of relative paths.
- Pure JS — no TypeScript. `pageExtensions` includes `md`/`mdx` so Markdown files anywhere under `pages/` become routes (avoid placing content there; put it in `data/`).
- Post slugs use kebab-case; `scripts/compose.js` enforces this.
- Authors in `data/authors/<name>.md` are referenced by filename via the `authors:` frontmatter array (default: `['default']`).
