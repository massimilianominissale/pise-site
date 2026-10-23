import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CopyButton } from '@/components/products/CopyButton'
import { ProductCard } from '@/components/products/ProductCard'
import {
  ProductShowcase,
  type ShowcaseFinish,
  type ShowcaseSlide,
} from '@/components/products/ProductShowcase'
import { Img, asMedia } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { type Dictionary, getDictionary } from '@/i18n/dictionary'
import { formatFile } from '@/lib/format'
import { docHref } from '@/lib/links'
import { getProductBySlug, getProductsOfBrand, getPublicDocuments } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'
import type {
  Brand,
  Faq,
  Media,
  Product,
  ProductCategory,
  Range,
  TeamMember,
} from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

const obj = <T,>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

const hasText = (rich: unknown) => !!rich && JSON.stringify(rich).includes('"text":"')

const absoluteUrl = (u: string) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u}`)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const product = await getProductBySlug(slug, locale)
  if (!product) return {}
  const brand = obj<Brand>(product.brand)
  return {
    title: product.meta?.title || [product.name, brand?.name].filter(Boolean).join(' · '),
    description: product.meta?.description || product.shortDescription || undefined,
    alternates: alternates(locale, `/produits/${slug}`),
    openGraph: { images: ogImages(product.meta?.image, ...(product.images ?? [])) },
  }
}

/** Lignes de caractéristiques renseignées (les champs vides ne s'affichent pas). */
const specRows = (product: Product, locale: Locale, t: Dictionary['product']) => {
  const n = (v: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(v)
  const d = product.dimensions ?? {}
  const letters = t.dimensionLetters
  const dims = [
    d.width != null ? `${letters.width} ${n(d.width)}` : null,
    d.depth != null ? `${letters.depth} ${n(d.depth)}` : null,
    d.height != null ? `${letters.height} ${n(d.height)}` : null,
    d.diameter != null ? `${letters.diameter} ${n(d.diameter)}` : null,
  ].filter(Boolean)
  const usage =
    product.indoor && product.outdoor
      ? t.usages.both
      : product.outdoor
        ? t.usages.outdoor
        : product.indoor
          ? t.usages.indoor
          : null
  const rows: { label: string; value: string }[] = []
  if (dims.length) rows.push({ label: t.dimensions, value: `${dims.join(' × ')} cm` })
  if (d.seatHeight != null) rows.push({ label: t.seatHeight, value: `${n(d.seatHeight)} cm` })
  if (product.materials) rows.push({ label: t.materials, value: product.materials })
  if (product.weight != null) rows.push({ label: t.weight, value: `${n(product.weight)} kg` })
  if (product.stackable) rows.push({ label: t.stackable, value: t.yes })
  if (usage) rows.push({ label: t.usage, value: usage })
  if (product.designer) rows.push({ label: t.designer, value: product.designer })
  if (product.warranty) rows.push({ label: t.warranty, value: product.warranty })
  if (product.certifications) rows.push({ label: t.certifications, value: product.certifications })
  for (const spec of product.specs ?? []) rows.push({ label: spec.label, value: spec.value })
  return rows
}

export default async function ProductPage({ params }: Props) {
  const { locale: param, slug } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.product

  const product = await getProductBySlug(slug, locale)
  if (!product) notFound()

  const brand = obj<Brand>(product.brand)
  const range = obj<Range>(product.range)
  const categories = (product.categories ?? []).map((c) => obj<ProductCategory>(c)).filter(Boolean)
  const referent = obj<TeamMember>(brand?.referent)
  const faqs = (product.faqs ?? []).map((f) => obj<Faq>(f)).filter((f): f is Faq => Boolean(f))
  const documentIds = (product.documents ?? []).map((d) => (typeof d === 'object' ? d.id : d))

  const [documents, brandProducts] = await Promise.all([
    getPublicDocuments(documentIds, locale),
    brand ? getProductsOfBrand(brand.id, locale, 5) : Promise.resolve({ docs: [], totalDocs: 0 }),
  ])

  // Photos : celles de la fiche, puis celles des finitions qui n'y sont pas déjà.
  const images: Media[] = []
  const pushImage = (value: unknown) => {
    const m = asMedia(value)
    if (m && !images.some((i) => i.id === m.id)) images.push(m)
  }
  ;(product.images ?? []).forEach(pushImage)
  ;(product.finishes ?? []).forEach((f) => pushImage(f.image))

  const finishes: ShowcaseFinish[] = (product.finishes ?? []).map((f, i) => {
    const image = asMedia(f.image)
    const slide = image ? images.findIndex((m) => m.id === image.id) : -1
    return {
      id: f.id ?? String(i),
      name: f.name,
      swatch: f.swatch ?? null,
      slide: slide >= 0 ? slide : null,
    }
  })

  const slides: ShowcaseSlide[] = images.map((m, i) => {
    const finish = finishes.find((f) => f.slide === i)
    return {
      id: String(m.id),
      url: m.url!,
      alt: m.alt ?? '',
      focalX: m.focalX,
      focalY: m.focalY,
      label: [t.view(i + 1, images.length), finish?.name].filter(Boolean).join(', '),
    }
  })

  // « Chez Nardi » : produits associés choisis dans le back-office, complétés par la marque.
  const related = (product.relatedProducts ?? [])
    .map((p) => obj<Product>(p))
    .filter((p): p is Product => Boolean(p && p.slug && p._status === 'published'))
  for (const p of brandProducts.docs) {
    if (p.id !== product.id && !related.some((r) => r.id === p.id)) related.push(p)
  }
  const moreProducts = related.slice(0, 4)

  const specs = specRows(product, locale, t)
  const permalinkPath = `/p/${encodeURIComponent(product.reference)}`
  const permalink = `${SITE_URL}${permalinkPath}`
  const permalinkLabel = `${new URL(SITE_URL).host}${permalinkPath}`
  const brandHref = brand ? docHref(locale, 'brands', brand) : null
  const quoteHref = `${localizedPath(locale, 'contact')}?${new URLSearchParams({
    demande: 'devis',
    produit: product.reference,
  })}`
  const appointmentHref = `${localizedPath(locale, 'appointment')}?${new URLSearchParams({
    ...(brand?.slug ? { fabricant: brand.slug } : {}),
    ...(referent ? { conseiller: String(referent.id) } : {}),
  })}`
  const contactHref = `${localizedPath(locale, 'contact')}?${new URLSearchParams({ produit: product.reference })}`
  const ambiance = [...(range?.gallery ?? []), ...images.slice(1)]
    .map(asMedia)
    .filter((m): m is Media => Boolean(m))
    .filter((m, i, all) => all.findIndex((x) => x.id === m.id) === i)
    .slice(0, 2)

  const url = `${SITE_URL}${docHref(locale, 'products', product)}`

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
                ...(brand && brandHref
                  ? [
                      {
                        '@type': 'ListItem',
                        position: 2,
                        name: brand.name,
                        item: `${SITE_URL}${brandHref}`,
                      },
                    ]
                  : []),
                {
                  '@type': 'ListItem',
                  position: 2 + (brand ? 1 : 0),
                  name: product.name,
                },
              ],
            },
            {
              '@type': 'Product',
              '@id': `${url}#product`,
              name: product.name,
              sku: product.reference,
              url,
              description: product.shortDescription || undefined,
              image: images.slice(0, 6).map((m) => absoluteUrl(m.url!)),
              brand: brand ? { '@type': 'Brand', name: brand.name } : undefined,
              category: categories.map((c) => c!.name).join(', ') || undefined,
              color: finishes.map((f) => f.name).join(', ') || undefined,
              material: product.materials || undefined,
              isRelatedTo: moreProducts.map((p) => ({
                '@type': 'Product',
                name: p.name,
                url: `${SITE_URL}${docHref(locale, 'products', p)}`,
              })),
            },
            ...(faqs.length
              ? [
                  {
                    '@type': 'FAQPage',
                    mainEntity: faqs.map((f) => ({
                      '@type': 'Question',
                      name: f.question,
                      acceptedAnswer: { '@type': 'Answer', text: f.answer },
                    })),
                  },
                ]
              : []),
          ],
        }}
      />

      <div className="product-page">
        <div className="container product-crumb">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={localizedPath(locale, 'brands')}>{dict.brands.listTitle}</Link>
            {brand && brandHref ? (
              <>
                {' / '}
                <Link href={brandHref}>{brand.name}</Link>
              </>
            ) : null}
            {' / '}
            <span aria-current="page">{product.name}</span>
          </nav>
        </div>

        <ProductShowcase
          slides={slides}
          finishes={finishes}
          badge={product.outdoor ? t.outdoor : null}
          labels={{ gallery: t.gallery, finish: t.finish, finishes: t.finishes }}
          head={
            <div className="pv__head">
              {brand ? (
                <Link className="pise-eyebrow pv__brand" href={brandHref ?? '#'}>
                  {brand.name}
                </Link>
              ) : null}
              <h1 className="pv__title">{product.name}</h1>
              {product.shortDescription ? (
                <p className="body pv__lead">{product.shortDescription}</p>
              ) : null}
              <div className="kv">
                <span>{t.reference}</span>
                <span>{product.reference}</span>
              </div>
            </div>
          }
          actions={
            <>
              <div className="pv__ctas">
                <Link className="pise-btn pv__quote" href={quoteHref}>
                  {t.quote}
                </Link>
                <Link
                  className="pise-btn pise-btn--outline"
                  href={localizedPath(locale, 'generator')}
                >
                  {t.seeInGenerator}
                </Link>
              </div>
              <div className="pv__pro">
                <span className="body">{t.proPrices}</span>
                <Link className="pise-textlink" href={localizedPath(locale, 'pro')}>
                  {t.proLogin}
                </Link>
              </div>
              <div className="pv__permalink">
                <span className="cap">
                  {t.permalink} : {permalinkLabel}
                </span>
                <CopyButton
                  className="pise-chip pise-chip--small"
                  value={permalink}
                  label={t.copy}
                  doneLabel={t.copied}
                />
              </div>
            </>
          }
        />

        {hasText(product.description) || specs.length || documents.length ? (
          <section className="product-details">
            <div className="container product-details__inner">
              <div className="product-details__specs">
                <h2 className="sec-title">{t.specs}</h2>
                {hasText(product.description) ? (
                  <RichText
                    data={product.description}
                    locale={locale}
                    className="body product-details__text"
                  />
                ) : null}
                {specs.length ? (
                  <dl className="spec">
                    {specs.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
              <div className="product-details__docs">
                {documents.length ? (
                  <>
                    <h2 className="h2">{t.documents}</h2>
                    <ul className="doc-list">
                      {documents.map((doc) => {
                        const ext = (doc.filename?.split('.').pop() ?? 'pdf')
                          .toUpperCase()
                          .slice(0, 4)
                        return (
                          <li key={doc.id}>
                            <a className="doc-row" href={doc.url ?? '#'} download>
                              <span className="doc-ic" aria-hidden="true">
                                {ext}
                              </span>
                              <span className="doc-row__name">{doc.title}</span>
                              <span className="cap">
                                {formatFile(locale, doc.mimeType, doc.filesize)}
                              </span>
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                ) : (
                  <h2 className="h2">{t.documents}</h2>
                )}
                <p className="cap product-details__pro">
                  {t.proDocs}{' '}
                  <Link className="pise-textlink" href={localizedPath(locale, 'pro')}>
                    {dict.pro}
                  </Link>
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {ambiance.length ? (
          <section
            className={`product-ambiance${ambiance.length === 1 ? ' product-ambiance--single' : ''}`}
          >
            {ambiance.map((m, i) => (
              <div
                key={m.id}
                className={`product-ambiance__img product-ambiance__img--${i === 0 ? 'a' : 'b'}`}
              >
                <Img
                  media={m}
                  sizes={
                    i === 0 ? '(min-width: 768px) 42vw, 50vw' : '(min-width: 768px) 58vw, 50vw'
                  }
                />
              </div>
            ))}
          </section>
        ) : null}

        <section className="container product-generator-wrap">
          <div className="product-generator">
            <div className="product-generator__text">
              <span className="pise-eyebrow on-ink-mute">{dict.generator.eyebrow}</span>
              <h2 className="h2">{t.generatorTitle(product.name)}</h2>
              <p className="body on-ink-mute">{t.generatorText}</p>
            </div>
            <Link className="pise-btn pise-btn--light" href={localizedPath(locale, 'generator')}>
              {t.generatorCta}
            </Link>
          </div>
        </section>

        {moreProducts.length ? (
          <section className="container section section--loose product-more">
            <div className="section-head">
              <h2 className="sec-title">{brand ? t.atBrand(brand.name) : t.seeAll}</h2>
              {brandHref ? (
                <Link className="pise-link" href={brandHref}>
                  {t.allBrand}
                </Link>
              ) : null}
            </div>
            <div className="product-grid">
              {moreProducts.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}

        {faqs.length ? (
          <section className="container product-faq">
            <div className="product-faq__intro">
              <h2 className="sec-title">{t.faq}</h2>
              {brand ? <p className="body mute">{t.faqLead(brand.name)}</p> : null}
            </div>
            <div className="product-faq__list">
              {faqs.map((faq, i) => (
                <details key={faq.id} className="qa" open={i === 0}>
                  <summary>{faq.question}</summary>
                  <p className="body mute">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="band band--stone">
          <div className="container product-referent">
            {referent && asMedia(referent.photo) ? (
              <div className="product-referent__photo">
                <Img media={referent.photo} sizes="72px" />
              </div>
            ) : null}
            <div className="product-referent__text">
              <span className="pise-eyebrow eyebrow-mute">
                {brand ? t.referent(brand.name) : dict.appointments.eyebrow}
              </span>
              <span className="h3">{referent ? referent.name : t.contactTitle}</span>
              {referent ? (
                <span className="cap">
                  {[referent.zone, referent.phone].filter(Boolean).join(' · ')}
                </span>
              ) : null}
            </div>
            <div className="product-referent__actions">
              <Link className="pise-btn" href={appointmentHref}>
                {dict.takeAppointment}
              </Link>
              <Link className="pise-btn pise-btn--outline" href={contactHref}>
                {t.write}
              </Link>
            </div>
          </div>
        </section>

        <div className="product-bar">
          <Link className="pise-btn" href={quoteHref}>
            {t.quote}
          </Link>
          <CopyButton
            className="pise-btn pise-btn--outline product-bar__share"
            value={permalink}
            label={t.share}
            doneLabel={t.copied}
            share={{ title: product.name }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </CopyButton>
        </div>
      </div>
    </>
  )
}
