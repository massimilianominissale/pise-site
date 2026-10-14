import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EmbedViewer } from '@/components/ui/EmbedViewer'
import { asMedia, Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { safeEmbedUrl } from '@/lib/embed'
import { getGlobal, getIntegrations } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  return {
    title: listings.generator?.title || dict.generator.eyebrow,
    description: listings.generator?.lead || dict.generatorPage.lead,
    alternates: alternates(locale, '/generateur'),
    openGraph: { images: ogImages(listings.generator?.image) },
  }
}

/**
 * Générateur de visuels d'aménagements : l'outil Mobilia en iframe. Mobilia ne prend aucun
 * paramètre d'URL ; ses légendes renvoient vers les fiches par le lien permanent /p/[référence].
 */
export default async function GeneratorPage({ params }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.generatorPage

  const [listings, home, integrations] = await Promise.all([
    getGlobal('listings', locale),
    getGlobal('home', locale),
    getIntegrations(),
  ])
  const src = integrations.mobilia.enabled
    ? safeEmbedUrl(integrations.mobilia.embedUrl, integrations.frameOrigins)
    : null
  const steps = home.generator?.steps ?? []
  const image = asMedia(listings.generator?.image) ?? asMedia(home.generator?.image)
  const title = listings.generator?.title || dict.generator.eyebrow
  const contact = `${localizedPath(locale, 'contact')}?demande=plans`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: title,
          url: `${SITE_URL}${localizedPath(locale, 'generator')}`,
          applicationCategory: 'DesignApplication',
          description: listings.generator?.lead || t.lead,
          provider: { '@type': 'Organization', name: 'Agence PISE' },
        }}
      />

      <section className="container page-intro">
        <div className="page-intro__title">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={localizedPath(locale)}>{dict.home}</Link> / {title}
          </nav>
          <h1 className="page-title page-title--md">{title}</h1>
        </div>
        <p className="lead page-intro__lead">{listings.generator?.lead || t.lead}</p>
      </section>

      <section className="container generator-tool">
        {src ? (
          <EmbedViewer
            src={src}
            title={t.tool}
            caption={t.tool}
            provider={t.provider}
            autoLoad
            className="viewer--tool"
            labels={{
              enter: dict.generator.cta,
              fullscreen: dict.toursPage.fullscreen,
              exitFullscreen: dict.toursPage.exitFullscreen,
            }}
          />
        ) : (
          <div className="generator-soon">
            {image ? (
              <div className="generator-soon__img">
                <Img media={image} sizes="(min-width: 1100px) 58vw, 100vw" priority />
              </div>
            ) : null}
            <div className="generator-soon__text">
              <span className="pise-eyebrow eyebrow-mute">{dict.tours.soon}</span>
              <h2 className="sec-title">{t.soonTitle}</h2>
              <p className="body mute">{t.soonText}</p>
              <div className="actions">
                <Link className="pise-btn" href={contact}>
                  {t.ctaButton}
                </Link>
                <Link
                  className="pise-btn pise-btn--outline"
                  href={localizedPath(locale, 'appointment')}
                >
                  {dict.takeAppointment}
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {steps.length ? (
        <section className="container how">
          <div className="how__intro">
            <span className="pise-eyebrow eyebrow-mute">{dict.generator.eyebrow}</span>
            <h2 className="sec-title">{t.howTitle}</h2>
          </div>
          <ol className={`how__steps how__steps--${Math.min(steps.length, 4)}`}>
            {steps.map((step, i) => (
              <li key={step.id ?? i} className="how__step">
                <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="h3">{step.title}</span>
                {step.text ? <p className="body mute">{step.text}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {src ? (
        <section className="container cta-band">
          <h2 className="sec-title cta-band__title">{t.ctaTitle}</h2>
          <p className="body mute cta-band__text">{t.ctaText}</p>
          <div className="cta-band__action">
            <Link className="pise-btn" href={contact}>
              {t.ctaButton}
            </Link>
          </div>
        </section>
      ) : null}
    </>
  )
}
