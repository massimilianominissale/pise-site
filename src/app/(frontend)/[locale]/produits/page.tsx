import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductCard } from '@/components/products/ProductCard'
import { FilterSelect } from '@/components/ui/FilterSelect'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { docHref } from '@/lib/links'
import { getCatalogFacets, getGlobal, getProducts } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'

type Search = { fabricant?: string; categorie?: string; page?: string }
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Search> }

const one = (v: unknown) => (typeof v === 'string' && v ? v : undefined)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  const search = await searchParams
  const filtered = Boolean(one(search.fabricant) || one(search.categorie) || one(search.page))
  return {
    title: listings.products?.title || dict.catalog.title,
    description: listings.products?.lead || dict.catalog.lead,
    alternates: alternates(locale, '/produits'),
    openGraph: { images: ogImages(listings.products?.image) },
    // Les pages filtrées renvoient vers le catalogue complet, qui seul est indexé.
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.catalog
  const search = await searchParams
  const brand = one(search.fabricant)
  const category = one(search.categorie)
  const page = Math.max(1, Number.parseInt(one(search.page) ?? '1', 10) || 1)

  const [listings, facets, result] = await Promise.all([
    getGlobal('listings', locale),
    getCatalogFacets(locale),
    getProducts(locale, { brand, category, page }),
  ])

  const base = localizedPath(locale, 'products')
  const hrefWith = (next: Search) => {
    const query = new URLSearchParams()
    const merged = { fabricant: brand, categorie: category, ...next }
    for (const [key, value] of Object.entries(merged)) if (value) query.set(key, value)
    const qs = query.toString()
    return qs ? `${base}?${qs}` : base
  }

  const title = listings.products?.title || t.title
  const count = (n: number) => (n > 1 ? t.countOther : t.countOne).replace('{n}', String(n))

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: title,
          itemListElement: result.docs.map((p, i) => ({
            '@type': 'ListItem',
            position: (result.page ? result.page - 1 : 0) * result.limit + i + 1,
            name: p.name,
            url: `${SITE_URL}${docHref(locale, 'products', p)}`,
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
        <p className="lead page-intro__lead">{listings.products?.lead || t.lead}</p>
      </section>

      <div className="bar">
        <div className="container bar__inner">
          {facets.categories.length > 1 ? (
            <nav className="pise-chips" aria-label={t.category}>
              <Link
                className="pise-chip"
                href={hrefWith({ categorie: undefined, page: undefined })}
                aria-current={!category ? 'page' : undefined}
                scroll={false}
              >
                {dict.allFeminine}
              </Link>
              {facets.categories.map((c) => (
                <Link
                  key={c.slug}
                  className="pise-chip"
                  href={hrefWith({ categorie: c.slug, page: undefined })}
                  aria-current={category === c.slug ? 'page' : undefined}
                  scroll={false}
                >
                  {c.name}
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
          <span className="bar__count mute" aria-live="polite">
            {count(result.totalDocs)}
          </span>
        </div>
      </div>

      <section className="container catalog">
        {result.docs.length ? (
          <div className="product-grid">
            {result.docs.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p className="body">{t.empty}</p>
            <Link className="pise-btn pise-btn--outline" href={base}>
              {t.reset}
            </Link>
          </div>
        )}

        {result.totalPages > 1 ? (
          <nav className="pagination" aria-label={t.pagination}>
            {result.hasPrevPage ? (
              <Link
                className="pise-link pise-link--back"
                href={hrefWith({ page: String(page - 1) })}
              >
                {t.previous}
              </Link>
            ) : (
              <span />
            )}
            <span className="cap">
              {t.page(page)} / {result.totalPages}
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
