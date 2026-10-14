import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard } from '@/components/news/PostCard'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { docHref } from '@/lib/links'
import { getGlobal, getPosts } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'

type Search = { categorie?: string; page?: string }
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Search> }

const CATEGORIES = ['new-products', 'trade-fairs', 'projects', 'agency', 'inspiration'] as const
type Category = (typeof CATEGORIES)[number]

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  const search = await searchParams
  return {
    title: listings.news?.title || dict.news,
    description: listings.news?.lead || dict.newsPage.lead,
    alternates: alternates(locale, '/actualites'),
    openGraph: { images: ogImages(listings.news?.image) },
    ...(search.categorie || search.page ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.newsPage
  const search = await searchParams
  const category = CATEGORIES.find((c) => c === search.categorie) as Category | undefined
  const page = Math.max(1, Number.parseInt(search.page ?? '1', 10) || 1)

  const [listings, result, all] = await Promise.all([
    getGlobal('listings', locale),
    getPosts(locale, { category, page }),
    getPosts(locale, { page: 1 }),
  ])
  const used = CATEGORIES.filter((c) => all.docs.some((p) => p.categories?.includes(c)))
  const base = localizedPath(locale, 'news')
  const hrefWith = (next: Search) => {
    const query = new URLSearchParams()
    const merged = { categorie: category, ...next }
    for (const [key, value] of Object.entries(merged)) if (value) query.set(key, value)
    const qs = query.toString()
    return qs ? `${base}?${qs}` : base
  }
  const [first, ...rest] = result.docs
  const featured = page === 1 && !category ? first : undefined
  const grid = featured ? rest : result.docs
  const title = listings.news?.title || dict.news

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: title,
          url: `${SITE_URL}${base}`,
          blogPost: result.docs.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${SITE_URL}${docHref(locale, 'posts', p)}`,
            datePublished: p.publishedAt ?? p.createdAt,
          })),
        }}
      />

      <section className="container page-intro">
        <div className="page-intro__title">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={localizedPath(locale)}>{dict.home}</Link> / {title}
          </nav>
          <h1 className="page-title">{title}</h1>
        </div>
        <p className="lead page-intro__lead">{listings.news?.lead || t.lead}</p>
      </section>

      {used.length > 1 ? (
        <div className="bar">
          <div className="container bar__inner">
            <nav className="pise-chips" aria-label={t.category}>
              <Link
                className="pise-chip"
                href={hrefWith({ categorie: undefined, page: undefined })}
                aria-current={!category ? 'page' : undefined}
                scroll={false}
              >
                {dict.all}
              </Link>
              {used.map((c) => (
                <Link
                  key={c}
                  className="pise-chip"
                  href={hrefWith({ categorie: c, page: undefined })}
                  aria-current={category === c ? 'page' : undefined}
                  scroll={false}
                >
                  {t.categories[c]}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <section className="container news">
        {featured ? (
          <PostCard
            post={featured}
            locale={locale}
            dict={dict}
            large
            sizes="(min-width: 1100px) 58vw, 100vw"
          />
        ) : null}
        {grid.length ? (
          <div className="news__grid">
            {grid.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                locale={locale}
                dict={dict}
                sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            ))}
          </div>
        ) : null}
        {!result.docs.length ? (
          <div className="empty">
            <p className="body">{category ? t.emptyFiltered : t.empty}</p>
            {category ? (
              <Link className="pise-btn pise-btn--outline" href={base}>
                {t.reset}
              </Link>
            ) : null}
          </div>
        ) : null}
        {result.totalPages > 1 ? (
          <nav className="pagination" aria-label={t.pagination}>
            {result.hasPrevPage ? (
              <Link
                className="pise-link pise-link--back"
                href={hrefWith({ page: page > 2 ? String(page - 1) : undefined })}
              >
                {t.previous}
              </Link>
            ) : (
              <span />
            )}
            <span className="cap">
              {dict.catalog.page(page)} / {result.totalPages}
            </span>
            {result.hasNextPage ? (
              <Link className="pise-link" href={hrefWith({ page: String(page + 1) })}>
                {t.next}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>
    </>
  )
}
