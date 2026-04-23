import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center py-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
          dkp-consult
        </p>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Entre lignes de code &amp; lignes de vie
        </p>
        <div className="mb-5 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size="5" />
          <SocialIcon kind="github" href={siteMetadata.github} size="5" />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="5" />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size="5" />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size="5" />
        </div>
        <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{siteMetadata.author}</span>
          <span aria-hidden>•</span>
          <span>{`© ${new Date().getFullYear()}`}</span>
          <span aria-hidden>•</span>
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            {siteMetadata.siteUrl.replace(/^https?:\/\//, '')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
