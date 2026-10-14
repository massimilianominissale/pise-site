import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { PostCard, postDate } from '@/components/news/PostCard'
import { ProductCard } from '@/components/products/ProductCard'
import { asMedia, Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { formatDateRange } from '@/lib/format'
import { docHref } from '@/lib/links'
import { localizedDocPaths } from '@/lib/localized'
import { getPostBySlug, getPosts } from '@/lib/payload'
import { localizedAlternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Brand, Event, Product, Project, TeamMember } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

/** Nombre de mots du texte riche (temps de lecture à 200 mots par minute). */
const wordCount = (rich: unknown): number => {
  let count = 0
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { text?: string; children?: unknown[]; root?: unknown }
    if (typeof n.text === 'string') count += n.text.split(/\s+/).filter(Boolean).length
    if (n.root) walk(n.root)
    n.children?.forEach(walk)
  }
  walk(rich)
  return count
}

const absolute = (url?: string | null) =>
  url ? (/^https?:/.test(url) ? url : `${SITE_URL}${url}`) : undefined

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}
  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    alternates: localizedAlternates(locale, await localizedDocPaths('posts', 'news', post.id)),
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: ogImages(post.meta?.image, post.cover),
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale: param, slug } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.newsPage

  const post = await getPostBySlug(slug, locale)
  if (!post) notFound()
  if (post.slug && post.slug !== decodeURIComponent(slug)) {
    redirect(docHref(locale, 'posts', post) ?? localizedPath(locale, 'news'))
  }

  const { docs: recent } = await getPosts(locale, { page: 1 })
  const related = recent.filter((p) => p.id !== post.id).slice(0, 3)
  const author = post.author && typeof post.author === 'object' ? (post.author as TeamMember) : null
  const brands = (post.brands ?? []).filter((b): b is Brand => typeof b === 'object' && b !== null)
  const products = (post.products ?? []).filter(
    (p): p is Product => typeof p === 'object' && p !== null && p._status === 'published',
  )
  const event = post.event && typeof post.event === 'object' ? (post.event as Event) : null
  const project =
    post.project && typeof post.project === 'object' ? (post.project as Project) : null
  const minutes = Math.max(1, Math.round(wordCount(post.body) / 200))
  const category = post.categories?.[0] ? t.categories[post.categories[0]] : null
  const newsHref = localizedPath(locale, 'news')
  const url = `${SITE_URL}${docHref(locale, 'posts', post)}`
  const cover = asMedia(post.cover)
  const hasAside = brands.length > 0 || Boolean(event) || Boolean(project)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: dict.news,
                  item: `${SITE_URL}${newsHref}`,
                },
                { '@type': 'ListItem', position: 2, name: post.title },
              ],
            },
            {
              '@type': 'BlogPosting',
              '@id': `${url}#article`,
              headline: post.title,
              description: post.excerpt || undefined,
              url,
              mainEntityOfPage: url,
              inLanguage: locale,
              datePublished: post.publishedAt ?? post.createdAt,
              dateModified: post.updatedAt,
              image: absolute(cover?.url),
              wordCount: wordCount(post.body) || undefined,
              author: author
                ? { '@type': 'Person', name: author.name, jobTitle: author.jobTitle || undefined }
                : { '@type': 'Organization', name: 'Agence PISE' },
              publisher: {
                '@type': 'Organization',
                name: 'Agence PISE',
                logo: `${SITE_URL}/brand/pise-logo.png`,
              },
              about: [
                ...brands.map((b) => ({ '@type': 'Brand', name: b.name })),
                ...products.map((p) => ({
                  '@type': 'Product',
                  name: p.name,
                  url: `${SITE_URL}${docHref(locale, 'products', p)}`,
                })),
              ],
            },
          ],
        }}
      />

      <article className="article">
        <header className="container article__head">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={newsHref}>{dict.news}</Link>
            {category ? ` / ${category}` : ''}
          </nav>
          <span className="pise-eyebrow eyebrow-mute">
            {[postDate(post, locale), t.readingTime(minutes)].join(' · ')}
          </span>
          <h1 className="page-title page-title--md article__title">{post.title}</h1>
          {post.excerpt ? <p className="lead article__lead">{post.excerpt}</p> : null}
          {author ? (
            <div className="article__author">
              {asMedia(author.photo) ? (
                <span className="article__avatar">
                  <Img media={author.photo} sizes="48px" />
                </span>
              ) : null}
              <span className="cap">
                {t.by(author.name)}
                {author.jobTitle ? ` · ${author.jobTitle}` : ''}
              </span>
            </div>
          ) : null}
        </header>

        {cover ? (
          <div className="project-cover article__cover">
            <div className="project-cover__img">
              <Img media={cover} sizes="100vw" priority />
            </div>
          </div>
        ) : null}

        <div className={`container article__body${hasAside ? '' : ' article__body--solo'}`}>
          <RichText data={post.body} locale={locale} className="article__text" />
          {hasAside ? (
            <aside className="article__aside" aria-label={t.mentioned}>
              <span className="pise-eyebrow eyebrow-mute">{t.mentioned}</span>
              {brands.length ? (
                <ul className="rows">
                  {brands.map((b) => (
                    <li key={b.id} className="rdv-row">
                      <Link className="body" href={docHref(locale, 'brands', b) ?? '#'}>
                        {b.name}
                      </Link>
                      <span className="cap">{dict.brands.eyebrow}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {event ? (
                <Link className="article__ref" href={docHref(locale, 'events', event) ?? '#'}>
                  <span className="pise-eyebrow eyebrow-ocean">{t.event}</span>
                  <span className="h3">{event.name}</span>
                  <span className="cap">
                    {[formatDateRange(locale, event.startDate, event.endDate), event.city]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </Link>
              ) : null}
              {project ? (
                <Link className="article__ref" href={docHref(locale, 'projects', project) ?? '#'}>
                  <span className="pise-eyebrow eyebrow-ocean">{t.project}</span>
                  <span className="h3">{project.title}</span>
                  {project.city ? <span className="cap">{project.city}</span> : null}
                </Link>
              ) : null}
            </aside>
          ) : null}
        </div>
      </article>

      {products.length ? (
        <section className="container section section--flush">
          <div className="section-head">
            <h2 className="h2">{dict.brand.products}</h2>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="others">
          <div className="container section section--flush">
            <div className="section-head">
              <h2 className="h2">{t.related}</h2>
              <Link className="pise-link" href={newsHref}>
                {dict.news}
              </Link>
            </div>
            <div className="news__grid">
              {related.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  locale={locale}
                  dict={dict}
                  sizes="(min-width: 1100px) 33vw, 100vw"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
