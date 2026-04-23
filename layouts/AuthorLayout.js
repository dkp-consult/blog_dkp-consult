import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'

export default function AuthorLayout({ children, frontMatter }) {
  const { name, avatar, occupation, company, location, email, twitter, linkedin, github } =
    frontMatter

  return (
    <>
      <PageSEO title={`A propos - ${name}`} description={`A propos - ${name}`} />

      <section className="pt-10 pb-8 text-center sm:pt-16 sm:pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
          Qui suis-je ?
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          {name}
        </h1>
        {occupation && (
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{occupation}</p>
        )}
      </section>

      <div className="border-t border-gray-200 pt-10 dark:border-gray-800">
        <div className="grid gap-10 xl:grid-cols-3 xl:gap-12">
          <aside className="flex flex-col items-center xl:items-start">
            <Image
              src={avatar}
              alt={name}
              width={192}
              height={192}
              className="h-40 w-40 rounded-full ring-4 ring-primary-100 dark:ring-primary-900/40"
            />

            <dl className="mt-8 w-full max-w-xs space-y-4 text-sm xl:max-w-none">
              {company && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Activité
                  </dt>
                  <dd className="mt-1 text-gray-700 dark:text-gray-300">{company}</dd>
                </div>
              )}
              {location && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Basé à
                  </dt>
                  <dd className="mt-1 text-gray-700 dark:text-gray-300">{location}</dd>
                </div>
              )}
              {email && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Contact
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    >
                      {email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex space-x-3">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="twitter" href={twitter} />
            </div>
          </aside>

          <div className="prose max-w-none dark:prose-dark xl:col-span-2">{children}</div>
        </div>
      </div>
    </>
  )
}
