import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-100 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:border-primary-700 dark:hover:bg-primary-900/40"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
