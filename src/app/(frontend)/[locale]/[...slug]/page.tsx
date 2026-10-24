import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { AgencyJsonLd } from '@/components/agency/AgencyJsonLd'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { EventView } from '@/components/events/EventView'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath, ROUTES } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { docHref } from '@/lib/links'
import { localizedDocPaths, localizedPagePaths } from '@/lib/localized'
import { getEventBySlug, getEvents, getPageBySlug } from '@/lib/payload'
import { localizedAlternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Page } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string[] }> }

/** /agence/salons/[slug] : fiche d'un salon. */
const eventSlug = (locale: Locale, segments: string[]) =>
  segments.length === 3 && segments[0] === ROUTES.agency[locale] && segments[1] === 'salons'
    ? segments[2]
    : null

const decode = (segments: string[]) => segments.map((s) => decodeURIComponent(s))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const segments = decode(slug)
  const eSlug = eventSlug(locale, segments)
  if (eSlug) {
    const event = await getEventBySlug(eSlug, locale)
    if (!event) return {}
    return {
      title: event.meta?.title || event.name,
      description: event.meta?.description || event.summary || undefined,
      alternates: localizedAlternates(
        locale,
        await localizedDocPaths('events', 'agency', event.id, 'salons'),
      ),
      openGraph: { images: ogImages(event.meta?.image, event.image) },
    }
  }
  const page = await getPageBySlug(segments[segments.length - 1], locale)
  if (!page) return {}
  const hero = page.layout?.find((b) => b.blockType === 'hero')
  // Titre saisi qui contient déjà le nom du site : pas de « · Agence PISE » ajouté en plus.
  const metaTitle = page.meta?.title
  return {
    title: metaTitle?.includes('Agence PISE') ? { absolute: metaTitle } : metaTitle || page.title,
    description:
      page.meta?.description || (hero && 'lead' in hero ? hero.lead : undefined) || undefined,
    alternates: localizedAlternates(locale, await localizedPagePaths(page.id)),
    openGraph: {
      images: ogImages(page.meta?.image, hero && 'image' in hero ? hero.image : undefined),
    },
  }
}

/**
 * Adresses sans gabarit dédié : pages libres du back-office (À propos, mentions légales…),
 * avec leurs pages parentes (/agence/equipe), et fiches des salons. Sinon, page 404.
 */
export default async function CatchAll({ params }: Props) {
  const { locale: param, slug } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const segments = decode(slug)
  const requested = localizedPath(locale, null, ...segments)

  const eSlug = eventSlug(locale, segments)
  if (eSlug) {
    const event = await getEventBySlug(eSlug, locale)
    if (!event) notFound()
    const canonical = docHref(locale, 'events', event)
    if (canonical && canonical !== requested) redirect(canonical)
    return <EventView event={event} locale={locale} dict={dict} />
  }

  const page = await getPageBySlug(segments[segments.length - 1], locale)
  if (!page) notFound()
  const canonical = docHref(locale, 'pages', page)
  if (canonical && canonical !== requested) redirect(canonical)

  // Fil d'Ariane : accueil, pages parentes, page.
  const parents: Page[] = []
  let parent = page.parent && typeof page.parent === 'object' ? (page.parent as Page) : null
  while (parent && parents.length < 3) {
    parents.unshift(parent)
    parent = parent.parent && typeof parent.parent === 'object' ? (parent.parent as Page) : null
  }
  const crumb = (
    <nav aria-label={dict.breadcrumb}>
      <Link href={localizedPath(locale)}>{dict.home}</Link>
      {parents.map((p) => (
        <span key={p.id}>
          {' / '}
          <Link href={docHref(locale, 'pages', p) ?? '#'}>{p.title}</Link>
        </span>
      ))}
      {' / '}
      {page.title}
    </nav>
  )
  const blocks = page.layout ?? []
  const startsWithHero = blocks[0]?.blockType === 'hero'
  const periods = new Set(
    blocks.flatMap((b) => (b.blockType === 'events' ? [b.period ?? 'upcoming'] : [])),
  )
  const [upcoming, past] = await Promise.all([
    periods.has('upcoming') ? getEvents(locale, 'upcoming') : [],
    periods.has('past') ? getEvents(locale, 'past') : [],
  ])

  // Page « L'agence » (/agence) : organisation, siège et showrooms en données structurées.
  const isAgency = segments.length === 1 && segments[0] === ROUTES.agency[locale]
  const trail = [
    { name: dict.home, href: localizedPath(locale) },
    ...parents.map((p) => ({ name: p.title, href: docHref(locale, 'pages', p) })),
    { name: page.title, href: null },
  ]

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
          })),
        }}
      />
      {isAgency ? <AgencyJsonLd locale={locale} /> : null}
      {startsWithHero ? null : (
        <section className="container page-intro">
          <div className="page-intro__title">
            <div className="crumb">{crumb}</div>
            <h1 className="page-title page-title--md">{page.title}</h1>
          </div>
        </section>
      )}
      <PageBlocks blocks={blocks} locale={locale} crumb={crumb} events={{ upcoming, past }} />
    </>
  )
}
