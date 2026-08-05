const fs = require('fs')
const globby = require('globby')
const matter = require('gray-matter')
const prettier = require('prettier')
const siteMetadata = require('../data/siteMetadata')

const isMarkdown = (page) => /\.mdx?$/.test(page)

/**
 * Turns a source path into the route the sitemap should advertise, or null when
 * the page must be left out. Kept free of any filesystem access so it can be
 * tested: the caller reads the frontmatter and passes it in.
 */
function pageToRoute(page, frontMatter = {}) {
  // A draft is not published, and a post declaring its canonical URL elsewhere
  // must not be advertised here either.
  if (isMarkdown(page) && (frontMatter.draft || frontMatter.canonicalUrl)) {
    return null
  }

  // The 404 and the catch-all are routes of the framework, not of the content.
  if (page.includes('pages/404.') || page.includes('pages/blog/[...slug].')) {
    return null
  }

  const path = page
    .replace('pages/', '/')
    .replace('data/blog', '/blog')
    .replace('public/', '/')
    .replace('.js', '')
    .replace('.tsx', '')
    .replace('.mdx', '')
    .replace('.md', '')
    .replace('/feed.xml', '')

  return path === '/index' ? '' : path
}

async function generateSitemap() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  // globby does not guarantee an order, so two builds of the same content could
  // emit the same URLs in a different sequence. Sorting keeps the output stable.
  const pages = await globby([
    'pages/*.js',
    'pages/*.tsx',
    'data/blog/**/*.mdx',
    'data/blog/**/*.md',
    'public/tags/**/*.xml',
    '!pages/_*.js',
    '!pages/_*.tsx',
    '!pages/api',
  ])
  pages.sort()

  const routes = pages
    .map((page) => {
      const frontMatter =
        isMarkdown(page) && fs.existsSync(page) ? matter(fs.readFileSync(page, 'utf8')).data : {}

      return pageToRoute(page, frontMatter)
    })
    .filter((route) => route !== null)

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${routes
              .map(
                (route) => `
                        <url>
                            <loc>${siteMetadata.siteUrl}${route}</loc>
                        </url>
                    `
              )
              .join('')}
        </urlset>
    `

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  fs.writeFileSync('public/sitemap.xml', formatted)
}

// Only run when invoked as a script, so importing pageToRoute in a test does not
// rewrite public/sitemap.xml as a side effect.
if (require.main === module) {
  generateSitemap()
}

module.exports = { pageToRoute, generateSitemap }
