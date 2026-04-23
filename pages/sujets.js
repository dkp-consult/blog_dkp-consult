import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import { SearchBar } from '@/components/SearchDialog'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'

export async function getStaticProps() {
  const tags = await getAllTags('blog')

  return { props: { tags } }
}

export default function Tags({ tags }) {
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
  return (
    <>
      <PageSEO title={`Sujets - dkp-consult`} description="Thèmes et sujets abordés sur le blog" />

      <section className="pt-10 pb-8 text-center sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
          Explorer par thème
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Thèmes
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
          {sortedTags.length} sujet{sortedTags.length > 1 ? 's' : ''} couverts à travers les
          articles du blog.
        </p>
        <div className="mt-8 flex justify-center">
          <SearchBar />
        </div>
      </section>

      <div className="border-t border-gray-200 py-10 dark:border-gray-800">
        {sortedTags.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">Aucun sujet trouvé.</p>
        )}
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
          {sortedTags.map((t) => (
            <Link
              key={t}
              href={`/tags/${kebabCase(t)}`}
              className="group inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-100 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:border-primary-700 dark:hover:bg-primary-900/40"
            >
              <span>{t.split(' ').join('-')}</span>
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 group-hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:group-hover:bg-primary-900/70">
                {tags[t]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
