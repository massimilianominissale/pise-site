import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProjectTile } from '@/components/projects/ProjectTile'
import { FilterSelect } from '@/components/ui/FilterSelect'
import { Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { namesOf } from '@/lib/format'
import { docHref } from '@/lib/links'
import { getGlobal, getProjectFacets, getProjectsList } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'

type Search = { secteur?: string; fabricant?: string; region?: string; page?: string }
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Search> }

const one = (v: unknown) => (typeof v === 'string' && v ? v : undefined)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  const search = await searchParams
  const filtered = Boolean(
    one(search.secteur) || one(search.fabricant) || one(search.region) || one(search.page),
  )
  return {
    title: listings.projects?.title || dict.projects.eyebrow,
    description: listings.projects?.lead || dict.projectsPage.lead,
    alternates: alternates(locale, '/realisations'),
    openGraph: { images: ogImages(listings.projects?.image) },
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.projectsPage
  const search = await searchParams
  const sector = one(search.secteur)
  const brand = one(search.fabricant)
  const region = one(search.region)
  const page = Math.max(1, Number.parseInt(one(search.page) ?? '1', 10) || 1)
  const filtered = Boolean(sector || brand || region)

  const [listings, facets, result] = await Promise.all([
    getGlobal('listings', locale),
    getProjectFacets(locale),
    getProjectsList(locale, { sector, brand, region, page }),
  ])

  // Projet à la une : le premier projet mis en avant, hors filtres ; il ne se répète pas dessous.
  const featured = !filtered ? result.docs.find((p) => p.featured) : undefined
  const projects = result.docs.filter((p) => p.id !== featured?.id)

  const base = localizedPath(locale, 'projects')
  const hrefWith = (next: Search) => {
    const query = new URLSearchParams()
    const merged = { secteur: sector, fabricant: brand, region, ...next }
    for (const [key, value] of Object.entries(merged)) if (value) query.set(key, value)
    const qs = query.toString()
    return qs ? `${base}?${qs}` : base
  }
  const title = listings.projects?.title || dict.projects.eyebrow
  const count = (n: number) => (n > 1 ? t.countOther : t.countOne).replace('{n}', String(n))
  const appointment = localizedPath(locale, 'appointment')
  const hasAny = facets.sectors.length > 0 || facets.brands.length > 0 || result.totalDocs > 0

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: title,
          itemListElement: result.docs.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            url: `${SITE_URL}${docHref(locale, 'projects', p)}`,
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
        <p className="lead page-intro__lead">{listings.projects?.lead || t.lead}</p>
      </section>

      {featured ? (
        <section className="project-feature-wrap">
          <Link className="project-feature" href={docHref(locale, 'projects', featured) ?? '#'}>
            <Img media={featured.cover} sizes="100vw" priority />
            <span className="project-feature__card">
              <span className="pise-eyebrow eyebrow-ocean">{t.featured}</span>
              <span className="h2">{featured.title}</span>
              <span className="cap">
                {[namesOf(featured.sectors)[0], featured.city, featured.year]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
              {namesOf(featured.brands).length ? (
                <span className="tagrow">
                  {namesOf(featured.brands).map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </span>
              ) : null}
              <span className="pise-link">{t.see}</span>
            </span>
          </Link>
        </section>
      ) : null}

      {hasAny ? (
        <div className={`bar${featured ? ' bar--after-feature' : ''}`}>
          <div className="container bar__inner">
            {facets.sectors.length > 1 ? (
              <nav className="pise-chips" aria-label={t.sector}>
                <Link
                  className="pise-chip"
                  href={hrefWith({ secteur: undefined, page: undefined })}
                  aria-current={!sector ? 'page' : undefined}
                  scroll={false}
                >
                  {dict.all}
                </Link>
                {facets.sectors.map((s) => (
                  <Link
                    key={s.slug}
                    className="pise-chip"
                    href={hrefWith({ secteur: s.slug, page: undefined })}
                    aria-current={sector === s.slug ? 'page' : undefined}
                    scroll={false}
                  >
                    {s.name}
                  </Link>
                ))}
              </nav>
            ) : null}
            {facets.brands.length > 1 ? (
              <>
                <span className="bar__sep" aria-hidden="true" />
                <FilterSelect
                  label={t.brand}
                  value={brand ?? ''}
                  options={[
                    {
                      value: '',
                      label: t.allBrands,
                      href: hrefWith({ fabricant: undefined, page: undefined }),
                    },
                    ...facets.brands.map((b) => ({
                      value: b.slug,
                      label: b.name,
                      href: hrefWith({ fabricant: b.slug, page: undefined }),
                    })),
                  ]}
                />
              </>
            ) : null}
            {facets.regions.length > 1 ? (
              <FilterSelect
                label={t.region}
                value={region ?? ''}
                options={[
                  {
                    value: '',
                    label: t.allRegions,
                    href: hrefWith({ region: undefined, page: undefined }),
                  },
                  ...facets.regions.map((r) => ({
                    value: r,
                    label: r,
                    href: hrefWith({ region: r, page: undefined }),
                  })),
                ]}
              />
            ) : null}
            <span className="bar__count mute" aria-live="polite">
              {count(result.totalDocs)}
            </span>
          </div>
        </div>
      ) : null}

      <section className="container projects-list">
        {projects.length ? (
          <div className="masonry">
            {projects.map((project) => (
              <ProjectTile
                key={project.id}
                project={project}
                locale={locale}
                sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            ))}
          </div>
        ) : featured ? null : (
          <div className="empty">
            <p className="body">{filtered ? t.emptyFiltered : t.empty}</p>
            {filtered ? (
              <Link className="pise-btn pise-btn--outline" href={base}>
                {t.reset}
              </Link>
            ) : (
              <Link className="pise-btn" href={appointment}>
                {dict.takeAppointment}
              </Link>
            )}
          </div>
        )}
        {result.hasNextPage ? (
          <div className="projects-list__more">
            <Link
              className="pise-btn pise-btn--outline"
              href={hrefWith({ page: String(page + 1) })}
              scroll={false}
            >
              {t.more}
            </Link>
          </div>
        ) : null}
      </section>

      <section className="container cta-band">
        <h2 className="sec-title cta-band__title">{t.ctaTitle}</h2>
        <p className="body mute cta-band__text">{t.ctaText}</p>
        <div className="cta-band__action">
          <Link className="pise-btn" href={appointment}>
            {dict.takeAppointment}
          </Link>
        </div>
      </section>
    </>
  )
}
