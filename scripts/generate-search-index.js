const fs = require('fs')
const path = require('path')
const globby = require('globby')
const matter = require('gray-matter')

const root = process.cwd()

function stripMarkdown(content) {
  return content
    .replace(/^\s*(import|export)\s.+$/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^[#>\-*\d.)\s]+/gm, ' ')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

;(async () => {
  const files = await globby(['data/blog/**/*.md', 'data/blog/**/*.mdx'])
  const entries = []

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const { data, content } = matter(source)
    if (data.draft) continue

    const slug = file.replace(/^data\/blog\//, '').replace(/\.(mdx|md)$/, '')
    const body = stripMarkdown(content).slice(0, 2000)

    entries.push({
      slug,
      title: data.title || '',
      summary: data.summary || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: data.date ? new Date(data.date).toISOString() : null,
      body,
    })
  }

  entries.sort((a, b) => (a.date < b.date ? 1 : -1))

  const outPath = path.join(root, 'public', 'search-index.json')
  fs.writeFileSync(outPath, JSON.stringify(entries))
  console.log(`Search index written to ${outPath} (${entries.length} posts)`)
})()
