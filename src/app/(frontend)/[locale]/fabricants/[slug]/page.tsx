import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BrandCard } from '@/components/brands/BrandCard'
import { ProductCard } from '@/components/products/ProductCard'
import { PlayIcon, ProjectCard } from '@/components/cards'
import { Img, asMedia } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { SectionNav } from '@/components/ui/SectionNav'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { toBrandSummary, universeLabels } from '@/lib/brands'
import { formatFile } from '@/lib/format'
import { docHref } from '@/lib/links'
import {
  getBrandBySlug,
  getBrands,
  getProductsOfBrand,
  getProjects,
  getPublicDocumentsOfBrand,
  getRangesOfBrand,
  getVirtualTours,
} from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Range, TeamMember } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

const hasStory = (story: unknown) =>
  !!story &&
  typeof story === 'object' &&
  JSON.stringify(story).includes('"text":"') // au moins un texte saisi

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const brand = await getBrandBySlug(slug, locale)
  if (!brand) return {}
  const dict = getDictionary(locale)
  const meta = [universeLabels(brand, dict).join(', '), brand.country].filter(Boolean).join(' · ')
  return {
    title: brand.meta?.title || brand.name,
    description: brand.meta?.description || brand.tagline || `${brand.name}${meta ? ` · ${meta}` : ''}`,
    alternates: alternates(locale, `/fabricants/${slug}`),
    openGraph: { images: ogImages(brand.meta?.image, brand.heroImage, brand.cardImage) },
  }
}

export default async function BrandPage({ params }: Props) {
  const { locale: param, slug } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.brand

  const brand = await getBrandBySlug(slug, locale)
  if (!brand) notFound()

  const [ranges, products, documents, tours, projects, allBrands] = await Promise.all([
    getRangesOfBrand(brand.id, locale),
    getProductsOfBrand(brand.id, locale, 4),
    getPublicDocumentsOfBrand(brand.id, locale),
    getVirtualTours(locale, { brandId: brand.id, limit: 1 }),
    getProjects(locale, { brandId: brand.id, limit: 2 }),
    getBrands(locale),
  ])

  const universes = universeLabels(brand, dict)
  const eyebrow = [universes.join(', '), brand.country].filter(Boolean).join(' · ')
  const referent = brand.referent && typeof brand.referent === 'object' ? (brand.referent as TeamMember) : null
  const tour = tours[0]
  const gallery = (brand.gallery ?? []).map(asMedia).filter(Boolean)
  const others = allBrands
    .filter((b) => b.id !== brand.id)
    .slice(0, 4)
    .map((b) => toBrandSummary(b, locale, dict))

  const appointment = localizedPath(locale, 'appointment')
  const withBrand = (params: Record<string, string>) =>
    `${appointment}?${new URLSearchParams({ fabricant: brand.slug ?? '', ...params })}`

  const facts = [
    brand.foundedYear ? { label: t.founded, value: String(brand.foundedYear) } : null,
    brand.country ? { label: t.manufacturing, value: brand.country } : null,
    ...(brand.keyFigures ?? []).map((f) => ({ label: f.label, value: f.value })),
    brand.certifications ? { label: t.certifications, value: brand.certifications, small: true } : null,
  ].filter((f): f is { label: string; value: string; small?: boolean } => Boolean(f))

  const sections = [
    { id: 'histoire', label: t.story },
    ranges.length ? { id: 'collections', label: t.collections } : null,
    products.docs.length ? { id: 'produits', label: t.products } : null,
    documents.length ? { id: 'documentation', label: t.documentation } : null,
    tour ? { id: 'visite', label: t.virtualTour } : null,
    projects.length ? { id: 'realisations', label: dict.projects.eyebrow } : null,
  ].filter((s): s is { id: string; label: string } => Boolean(s))

  const story = hasStory(brand.story)
  const logo = asMedia(brand.logo)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: dict.home, item: `${SITE_URL}${localizedPath(locale)}` },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: dict.brands.listTitle,
                  item: `${SITE_URL}${localizedPath(locale, 'brands')}`,
                },
                { '@type': 'ListItem', position: 3, name: brand.name },
              ],
            },
            {
              '@type': 'Brand',
              name: brand.name,
              description: brand.tagline || undefined,
              logo: logo?.url || undefined,
              url: `${SITE_URL}${docHref(locale, 'brands', brand)}`,
              sameAs: brand.website ? [brand.website] : undefined,
            },
          ],
        }}
      />

      <section className="brand-hero">
        <Img media={brand.heroImage ?? brand.cardImage} sizes="100vw" priority />
        <div className="brand-hero__scrim" />
        <div className="container brand-hero__text">
          <nav aria-label={dict.breadcrumb} className="cap brand-hero__crumb">
            <Link href={localizedPath(locale, 'brands')}>{dict.brands.listTitle}</Link> / {brand.name}
          </nav>
          {eyebrow ? <span className="pise-eyebrow">{eyebrow}</span> : null}
          <h1 className="brand-hero__title">{brand.name}</h1>
        </div>
      </section>

      {sections.length > 1 ? <SectionNav items={sections} label={t.sections} /> : null}

      <section id="histoire" className={`container brand-story${story || brand.tagline ? '' : ' brand-story--compact'}`}>
        <div className="brand-story__text">
          {logo ? (
            <div className="brand-story__logo">
              <Img media={logo} sizes="200px" className="contain" />
            </div>
          ) : null}
          {story ? (
            <RichText data={brand.story} locale={locale} className="lead" />
          ) : brand.tagline ? (
            <p className="lead">{brand.tagline}</p>
          ) : null}
          <div className="actions">
            <a className="pise-btn" href="#referent">
              {dict.takeAppointment}
            </a>
            {brand.website ? (
              <a className="pise-btn pise-btn--outline" href={brand.website} target="_blank" rel="noopener noreferrer">
                {t.officialSite} ↗
              </a>
            ) : null}
          </div>
        </div>
        {facts.length ? (
          <dl className="facts">
            {facts.map((fact) => (
              <div key={fact.label} className="facts__item">
                <dt className="pise-eyebrow eyebrow-mute">{fact.label}</dt>
                <dd className={fact.small ? 'h3' : 'h2'}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {gallery.length ? (
        <section className={`brand-gallery${gallery.length === 1 ? ' brand-gallery--single' : ''}`}>
          {gallery.slice(0, 2).map((image, i) => (
            <div key={image!.id} className={`brand-gallery__img brand-gallery__img--${i === 0 ? 'main' : 'side'}`}>
              <Img media={image} sizes={i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'} />
            </div>
          ))}
        </section>
      ) : null}

      {ranges.length ? (
        <section id="collections" className="container section section--loose">
          <div className="section-head">
            <h2 className="sec-title">{t.collections}</h2>
          </div>
          <div className="range-grid">
            {ranges.map((range: Range) => {
              const caption = range.designer ? t.designBy(range.designer) : null
              return (
                <Link key={range.id} className="range-card" href={docHref(locale, 'ranges', range) ?? '#'}>
                  <div className="range-card__img">
                    <Img media={range.heroImage} sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw" />
                  </div>
                  <span className="h3">{range.name}</span>
                  {caption ? <span className="cap">{caption}</span> : null}
                </Link>
              )
            })}
          </div>
        </section>
      ) : null}

      {products.docs.length ? (
        <section id="produits" className={`container section${ranges.length ? ' section--after' : ' section--loose'}`}>
          <div className="section-head">
            <h2 className="sec-title">{t.featuredProducts}</h2>
            {products.totalDocs > products.docs.length ? (
              <Link className="pise-link" href={`${localizedPath(locale, 'products')}?fabricant=${brand.slug}`}>
                {t.allProducts(brand.name)}
              </Link>
            ) : null}
          </div>
          <div className="product-grid">
            {products.docs.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} eyebrow="range" />
            ))}
          </div>
        </section>
      ) : null}

      {documents.length ? (
        <section id="documentation" className="band band--stone">
          <div className="container docs">
            <div className="docs__intro">
              <h2 className="sec-title">{t.documentation}</h2>
              <p className="body mute">{t.documentationLead}</p>
            </div>
            <ul className="docs__list">
              {documents.map((doc) => (
                <li key={doc.id} className="docs__row">
                  <span className="pise-eyebrow eyebrow-mute docs__kind">{t.docKinds[doc.kind]}</span>
                  <span className="body docs__name">{doc.title}</span>
                  <span className="cap">{formatFile(locale, doc.mimeType, doc.filesize)}</span>
                  {doc.url ? (
                    <a className="pise-link" href={doc.url} download>
                      {t.download}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {tour ? (
        <section id="visite" className="band band--ink">
          <div className="container split split--tour">
            <Link className="tour-visual" href={docHref(locale, 'tours', tour) ?? '#'} aria-label={tour.title}>
              <Img media={tour.thumbnail ?? brand.heroImage} sizes="(min-width: 1100px) 55vw, 100vw" alt="" />
              <span className="tour-card__scrim" />
              <span className="tour-card__play">
                <PlayIcon />
              </span>
            </Link>
            <div className="split__text">
              <span className="pise-eyebrow eyebrow-sky">{t.virtualTour}</span>
              <h2 className="sec-title">{tour.kind === 'brand-showroom' ? t.tourTitle(brand.name) : tour.title}</h2>
              <p className="body on-ink-mute">{tour.summary || t.tourText}</p>
              <div className="actions actions--center">
                <Link className="pise-btn pise-btn--light" href={docHref(locale, 'tours', tour) ?? '#'}>
                  {t.enter}
                </Link>
                <Link className="pise-link pise-link--light" href={withBrand({ format: 'virtual-tour' })}>
                  {t.guidedTour}
                </Link>
              </div>
              {tour.credit ? <span className="cap on-ink-mute">{t.producedBy(tour.credit)}</span> : null}
            </div>
          </div>
        </section>
      ) : null}

      {projects.length ? (
        <section id="realisations" className="container section section--loose">
          <div className="section-head">
            <h2 className="sec-title">{t.projects(brand.name)}</h2>
            <Link className="pise-link" href={localizedPath(locale, 'projects')}>
              {t.allProjects}
            </Link>
          </div>
          <div className="project-grid project-grid--2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} sizes="(min-width: 768px) 50vw, 100vw" />
            ))}
          </div>
        </section>
      ) : null}

      <section id="referent" className="container referent-wrap">
        <div className={`referent${referent && asMedia(referent.photo) ? '' : ' referent--no-photo'}`}>
          {referent && asMedia(referent.photo) ? (
            <div className="referent__photo">
              <Img media={referent.photo} sizes="160px" />
            </div>
          ) : null}
          <div className="referent__text">
            <span className="pise-eyebrow eyebrow-mute">
              {referent ? t.referent(brand.name) : dict.appointments.eyebrow}
            </span>
            <span className="h2">{referent ? referent.name : t.projectWith(brand.name)}</span>
            <span className="body mute">
              {referent ? [referent.jobTitle, referent.zone].filter(Boolean).join(' · ') : t.projectWithText}
            </span>
          </div>
          <div className="referent__actions">
            <Link
              className="pise-btn"
              href={withBrand({ format: 'video', ...(referent ? { conseiller: String(referent.id) } : {}) })}
            >
              {t.videoCall}
            </Link>
            <Link
              className="pise-btn pise-btn--outline"
              href={withBrand({ format: 'showroom', ...(referent ? { conseiller: String(referent.id) } : {}) })}
            >
              {t.showroomVisit}
            </Link>
          </div>
        </div>
      </section>

      {others.length ? (
        <section className="others">
          <div className="container section section--flush">
            <h2 className="h2">{dict.brands.others}</h2>
            <div className="brand-grid">
              {others.map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
