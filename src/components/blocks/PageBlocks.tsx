import Link from 'next/link'

import { asMedia, Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { RichText } from '@/components/ui/RichText'
import type { Locale } from '@/i18n/config'
import { formatDateRange } from '@/lib/format'
import { docHref, type LinkValue, resolveLink } from '@/lib/links'
import type { Event, Faq, Media, Page, TeamMember } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]

/** Salons chargés par la page pour les blocs « Liste de salons ». */
export type PageEvents = { upcoming: Event[]; past: Event[] }

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
  events = { upcoming: [], past: [] },
}: {
  blocks: Block[]
  locale: Locale
  /** Fil d'Ariane, affiché dans l'en-tête de page. */
  crumb: React.ReactNode
  events?: PageEvents
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
          case 'team': {
            const members = (block.members ?? []).filter(
              (m): m is TeamMember => typeof m === 'object' && m !== null,
            )
            if (!members.length) return null
            return (
              <section key={key} className="band band--stone block-team">
                <div className="container">
                  <div className="section-head block-team__head">
                    {block.title ? <h2 className="sec-title">{block.title}</h2> : null}
                    {block.text ? <p className="body mute">{block.text}</p> : null}
                  </div>
                  <ul className="team-grid">
                    {members.map((member) => (
                      <li key={member.id} className="team-card">
                        <div className="team-card__img">
                          <Img
                            media={member.photo}
                            sizes="(min-width: 1100px) 25vw, 50vw"
                            className="contain"
                          />
                        </div>
                        <h3 className="h3 team-card__name">{member.name}</h3>
                        {member.jobTitle || member.zone ? (
                          <p className="cap team-card__role">
                            {[member.jobTitle, member.zone].filter(Boolean).join(' · ')}
                          </p>
                        ) : null}
                        <p className="body team-card__contact">
                          {member.phone ? (
                            <a href={`tel:${member.phone.replace(/\s/g, '')}`}>{member.phone}</a>
                          ) : null}
                          {member.email ? (
                            <a href={`mailto:${member.email}`}>{member.email}</a>
                          ) : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
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
          case 'events': {
            const list = block.period === 'past' ? events.past : events.upcoming
            if (!list.length) return null
            return (
              <section key={key} className="container news block-events">
                {block.title ? <h2 className="sec-title">{block.title}</h2> : null}
                <div className="news__grid">
                  {list.map((event) => {
                    const place = [event.city, event.venue].filter(Boolean).join(' · ')
                    return (
                      <Link
                        key={event.id}
                        className="post-card"
                        href={docHref(locale, 'events', event) ?? '#'}
                      >
                        <div className="post-card__img">
                          <Img
                            media={event.image}
                            sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                        <div className="post-card__text">
                          <span className="pise-eyebrow eyebrow-mute">
                            {formatDateRange(locale, event.startDate, event.endDate)}
                          </span>
                          <span className="h3">{event.name}</span>
                          {place ? <p className="body mute">{place}</p> : null}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          }
          default:
            return null
        }
      })}
    </>
  )
}
