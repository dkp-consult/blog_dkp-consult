import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import { SearchBar } from '@/components/SearchDialog'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

const MAX_DISPLAY = 5

const coverOf = (frontMatter) =>
  (Array.isArray(frontMatter.images) && frontMatter.images[0]) || siteMetadata.socialBanner

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />

      <section className="pt-10 pb-16 text-center sm:pt-16 sm:pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
          Le blog de {siteMetadata.author}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl md:leading-[1.1]">
          Entre lignes de code
          <br />
          <span className="text-primary-600 dark:text-primary-400">&amp; lignes de vie</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
          {siteMetadata.description}
        </p>
        <div className="mt-10 flex justify-center">
          <SearchBar />
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-baseline justify-between pt-10 pb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Dernières publications
          </h2>
          {posts.length > MAX_DISPLAY && (
            <Link
              href="/blog"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Tous les articles &rarr;
            </Link>
          )}
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            const cover = coverOf(frontMatter)
            return (
              <li key={slug} className="py-6 xl:py-8">
                <article className="group flex gap-4 xl:grid xl:grid-cols-[240px_1fr] xl:items-start xl:gap-8">
                  <Link
                    href={`/blog/${slug}`}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="order-last flex-shrink-0 xl:order-first xl:flex xl:flex-col xl:self-stretch xl:pt-[6px]"
                  >
                    <div className="h-28 w-28 overflow-hidden rounded-lg sm:h-32 sm:w-32 xl:h-auto xl:w-full xl:flex-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <time
                      dateTime={date}
                      className="mt-3 hidden text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 xl:block"
                    >
                      {formatDate(date)}
                    </time>
                  </Link>
                  <div className="min-w-0 flex-1 space-y-2 xl:space-y-3">
                    <time
                      dateTime={date}
                      className="block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 xl:hidden"
                    >
                      {formatDate(date)}
                    </time>
                    <h3 className="text-lg font-bold leading-snug tracking-tight sm:text-xl xl:text-2xl xl:leading-[1.15]">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-gray-900 transition-colors group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-400"
                      >
                        {title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    {summary && (
                      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400 xl:line-clamp-3 xl:text-base">
                        {summary}
                      </p>
                    )}
                    <div className="hidden pt-1 xl:block">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        aria-label={`Lire "${title}"`}
                      >
                        La suite &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
