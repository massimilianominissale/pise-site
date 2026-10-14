import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductCard } from '@/components/products/ProductCard'
import { Img, asMedia } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { universeLabels } from '@/lib/brands'
import { docHref } from '@/lib/links'
import { getProductsOfRange, getRange, getRangesOfBrand } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Media, Range } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string; range: string }> }

const hasText = (rich: unknown) => !!rich && JSON.stringify(rich).includes('"text":"')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, range: rangeSlug } = await params
  if (!isLocale(locale)) return {}
  const found = await getRange(slug, rangeSlug, locale)
  if (!found) return {}
  const { range, brand } = found
  const dict = getDictionary(locale)
  return {
    title: range.meta?.title || `${range.name} · ${brand.name}`,
    description:
      range.meta?.description ||
      range.summary ||
      `${dict.product.collection(range.name)} · ${brand.name}`,
    alternates: alternates(locale, `/fabricants/${slug}/${rangeSlug}`),
    openGraph: { images: ogImages(range.meta?.image, range.heroImage, brand.heroImage) },
  }
}

export default async function RangePage({ params }: Props) {
  const { locale: param, slug, range: rangeSlug } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.range

  const found = await getRange(slug, rangeSlug, locale)
  if (!found) notFound()
  const { range, brand } = found

  const [products, siblings] = await Promise.all([
    getProductsOfRange(range.id, locale),
    getRangesOfBrand(brand.id, locale),
  ])
  const others = siblings.filter((r: Range) => r.id !== range.id).slice(0, 3)
  const brandHref = docHref(locale, 'brands', brand) ?? localizedPath(locale, 'brands')
  const gallery = (range.gallery ?? []).map(asMedia).filter((m): m is Media => Boolean(m))
  const eyebrow = [brand.name, universeLabels(brand, dict)[0]].filter(Boolean).join(' · ')
  const facts = [
    range.designer ? { label: t.designer, value: range.designer } : null,
    range.year ? { label: t.launched, value: String(range.year) } : null,
  ].filter((f): f is { label: string; value: string } => Boolean(f))
  const appointment = `${localizedPath(locale, 'appointment')}?${new URLSearchParams({ fabricant: brand.slug ?? '' })}`

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
                  name: dict.brands.listTitle,
                  item: `${SITE_URL}${localizedPath(locale, 'brands')}`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: brand.name,
                  item: `${SITE_URL}${brandHref}`,
                },
                { '@type': 'ListItem', position: 3, name: range.name },
              ],
            },
            {
              '@type': 'ProductCollection',
              name: range.name,
              description: range.summary || undefined,
              brand: { '@type': 'Brand', name: brand.name },
              hasPart: products.map((p) => ({
                '@type': 'Product',
                name: p.name,
                sku: p.reference,
                url: `${SITE_URL}${docHref(locale, 'products', p)}`,
              })),
            },
          ],
        }}
      />

      <section className="brand-hero brand-hero--range">
        <Img media={range.heroImage ?? brand.heroImage} sizes="100vw" priority />
        <div className="brand-hero__scrim" />
        <div className="container brand-hero__text">
          <nav aria-label={dict.breadcrumb} className="cap brand-hero__crumb">
            <Link href={localizedPath(locale, 'brands')}>{dict.brands.listTitle}</Link> /{' '}
            <Link href={brandHref}>{brand.name}</Link> / {range.name}
          </nav>
          <span className="pise-eyebrow">{eyebrow}</span>
          <h1 className="brand-hero__title">{range.name}</h1>
        </div>
      </section>

      {range.summary || hasText(range.description) || facts.length ? (
        <section className="container brand-story">
          <div className="brand-story__text">
            {hasText(range.description) ? (
              <RichText data={range.description} locale={locale} className="lead" />
            ) : range.summary ? (
              <p className="lead">{range.summary}</p>
            ) : null}
          </div>
          {facts.length ? (
            <dl className="facts">
              {facts.map((fact) => (
                <div key={fact.label} className="facts__item">
                  <dt className="pise-eyebrow eyebrow-mute">{fact.label}</dt>
                  <dd className="h2">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ) : null}

      <section className="container section section--loose">
        <div className="section-head">
          <h2 className="sec-title">{t.products}</h2>
          <Link className="pise-link" href={brandHref}>
            {t.backToBrand(brand.name)}
          </Link>
        </div>
        {products.length ? (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p className="body">{t.noProducts}</p>
            <Link className="pise-btn" href={appointment}>
              {dict.takeAppointment}
            </Link>
          </div>
        )}
      </section>

      {gallery.length ? (
        <section className={`brand-gallery${gallery.length === 1 ? ' brand-gallery--single' : ''}`}>
          {gallery.slice(0, 2).map((image, i) => (
            <div
              key={image.id}
              className={`brand-gallery__img brand-gallery__img--${i === 0 ? 'main' : 'side'}`}
            >
              <Img
                media={image}
                sizes={
                  i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
                }
              />
            </div>
          ))}
        </section>
      ) : null}

      {others.length ? (
        <section className="others">
          <div className="container section section--flush">
            <div className="section-head">
              <h2 className="h2">{t.otherRanges(brand.name)}</h2>
              <Link className="pise-link" href={brandHref}>
                {brand.name}
              </Link>
            </div>
            <div className="range-grid">
              {others.map((r) => (
                <Link
                  key={r.id}
                  className="range-card"
                  href={docHref(locale, 'ranges', { ...r, brand }) ?? '#'}
                >
                  <div className="range-card__img">
                    <Img
                      media={r.heroImage}
                      sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <span className="h3">{r.name}</span>
                  {r.designer ? (
                    <span className="cap">{dict.brand.designBy(r.designer)}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
