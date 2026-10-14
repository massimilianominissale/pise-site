import Link from 'next/link'

import { asMedia, Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { RichText } from '@/components/ui/RichText'
import type { Locale } from '@/i18n/config'
import { type LinkValue, resolveLink } from '@/lib/links'
import type { Faq, Media, Page } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]

const CtaLink = ({
  link,
  locale,
  className,
}: {
  link: unknown
  locale: Locale
  className: string
}) => {
  const resolved = resolveLink(link as LinkValue, locale)
  if (!resolved) return null
  return resolved.external || resolved.newTab ? (
    <a
      className={className}
      href={resolved.href}
      target={resolved.newTab ? '_blank' : undefined}
      rel="noopener noreferrer"
    >
      {resolved.label}
    </a>
  ) : (
    <Link className={className} href={resolved.href}>
      {resolved.label}
    </Link>
  )
}

/**
 * Blocs des pages libres (L'agence, l'équipe, mentions légales…). Le premier bloc « En-tête »
 * porte le titre principal de la page ; sans lui, la page affiche son titre en introduction.
 */
export function PageBlocks({
  blocks,
  locale,
  crumb,
}: {
  blocks: Block[]
  locale: Locale
  /** Fil d'Ariane, affiché dans l'en-tête de page. */
  crumb: React.ReactNode
}) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero': {
            const image = asMedia(block.image)
            const Title = i === 0 ? 'h1' : 'h2'
            return image ? (
              <section key={key} className="brand-hero page-hero">
                <Img media={image} sizes="100vw" priority={i === 0} />
                <div className="brand-hero__scrim" />
                <div className="container brand-hero__text">
                  {i === 0 ? <div className="cap brand-hero__crumb">{crumb}</div> : null}
                  {block.eyebrow ? <span className="pise-eyebrow">{block.eyebrow}</span> : null}
                  <Title className="brand-hero__title page-hero__title">{block.title}</Title>
                  {block.lead ? <p className="lead page-hero__lead">{block.lead}</p> : null}
                  <div className="actions">
                    <CtaLink
                      link={block.cta}
                      locale={locale}
                      className="pise-btn pise-btn--light"
                    />
                  </div>
                </div>
              </section>
            ) : (
              <section key={key} className="container page-intro">
                <div className="page-intro__title">
                  {i === 0 ? <div className="crumb">{crumb}</div> : null}
                  {block.eyebrow ? (
                    <span className="pise-eyebrow eyebrow-mute">{block.eyebrow}</span>
                  ) : null}
                  <Title className="page-title page-title--md">{block.title}</Title>
                </div>
                <div className="page-intro__lead">
                  {block.lead ? <p className="lead">{block.lead}</p> : null}
                  <div className="actions">
                    <CtaLink link={block.cta} locale={locale} className="pise-btn" />
                  </div>
                </div>
              </section>
            )
          }
          case 'content':
            return (
              <section key={key} className="container block-content">
                <RichText data={block.body} locale={locale} className="article__text" />
              </section>
            )
          case 'mediaText':
            return (
              <section
                key={key}
                className={`container split block-media${block.imagePosition === 'right' ? ' block-media--right' : ''}`}
              >
                <div className="block-media__img">
                  <Img media={block.image} sizes="(min-width: 1100px) 50vw, 100vw" />
                </div>
                <div className="split__text">
                  {block.title ? <h2 className="sec-title">{block.title}</h2> : null}
                  <RichText data={block.body} locale={locale} className="body" />
                  <div className="actions">
                    <CtaLink link={block.cta} locale={locale} className="pise-link" />
                  </div>
                </div>
              </section>
            )
          case 'gallery': {
            const images = (block.images ?? []).map(asMedia).filter((m): m is Media => Boolean(m))
            return (
              <section key={key} className="project-gallery block-gallery">
                {images.map((image, j) => (
                  <div
                    key={image.id}
                    className={`project-gallery__img project-gallery__img--${j % 3 === 0 ? 'wide' : 'half'}`}
                  >
                    <Img
                      media={image}
                      sizes={j % 3 === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                    />
                  </div>
                ))}
              </section>
            )
          }
          case 'faq': {
            const faqs = (block.faqs ?? []).filter(
              (f): f is Faq => typeof f === 'object' && f !== null,
            )
            return (
              <section key={key} className="container product-faq block-faq">
                <JsonLd
                  data={{
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: faqs.map((f) => ({
                      '@type': 'Question',
                      name: f.question,
                      acceptedAnswer: { '@type': 'Answer', text: f.answer },
                    })),
                  }}
                />
                <div className="product-faq__intro">
                  {block.title ? <h2 className="sec-title">{block.title}</h2> : null}
                </div>
                <div className="product-faq__list">
                  {faqs.map((faq, j) => (
                    <details key={faq.id} className="qa" open={j === 0}>
                      <summary>{faq.question}</summary>
                      <p className="body mute">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )
          }
          case 'cta':
            return (
              <section key={key} className="container cta-band">
                <h2 className="sec-title cta-band__title">{block.title}</h2>
                {block.text ? <p className="body mute cta-band__text">{block.text}</p> : <span />}
                <div className="cta-band__action actions">
                  {(block.links ?? []).map((row, j) => (
                    <CtaLink
                      key={row.id ?? j}
                      link={row.link}
                      locale={locale}
                      className={j === 0 ? 'pise-btn' : 'pise-btn pise-btn--outline'}
                    />
                  ))}
                </div>
              </section>
            )
          default:
            return null
        }
      })}
    </>
  )
}
