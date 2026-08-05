import Image from '@/components/Image'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Pagination from '@/components/Pagination'
import { SearchBar } from '@/components/SearchDialog'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'

const coverOf = (frontMatter) =>
  (Array.isArray(frontMatter.images) && frontMatter.images[0]) || siteMetadata.socialBanner

export default function ListLayout({ posts, title, initialDisplayPosts = [], pagination }) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="space-y-4 pt-10 pb-10 text-center sm:pt-16 sm:pb-14">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <div className="flex justify-center pt-2">
            <SearchBar />
          </div>
        </div>
        <ul className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {!displayPosts.length && 'No posts found.'}
          {displayPosts.map((frontMatter) => {
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
                    <div className="relative h-28 w-28 overflow-hidden rounded-lg sm:h-32 sm:w-32 xl:h-auto xl:w-full xl:flex-1">
                      {/* `sizes` mirrors the widths this box actually renders at:
                          112px, 128px from sm, and the 240px grid column from xl.
                          Without it next/image would serve a full-viewport variant. */}
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 240px, (min-width: 640px) 128px, 112px"
                        className="object-cover"
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
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
