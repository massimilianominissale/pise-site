import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProjectCard, TourCard } from '@/components/cards'
import { ImrsivoPartner } from '@/components/home/ImrsivoPartner'
import { Mosaic } from '@/components/home/Mosaic'
import { NewsletterForm } from '@/components/home/NewsletterForm'
import { JsonLd } from '@/components/ui/JsonLd'
import { Img, asMedia } from '@/components/ui/Img'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { formatDateRange } from '@/lib/format'
import {
  getBrands,
  getGlobal,
  getProjects,
  getUpcomingEvents,
  getVirtualTours,
} from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Project, VirtualTour } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

const published = <T extends { _status?: 'draft' | 'published' | null }>(
  items: unknown[] | null | undefined,
) =>
  (items ?? []).filter((i): i is T => !!i && typeof i === 'object' && (i as T)._status !== 'draft')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const [home, settings] = await Promise.all([
    getGlobal('home', locale),
    getGlobal('settings', locale),
  ])
  const firstTile = home.mosaic?.[0]?.image
  return {
    title: { absolute: home.meta?.title || settings.siteName || 'Agence PISE' },
    description: home.meta?.description || home.manifestoLead || settings.description || undefined,
    alternates: alternates(locale, '/'),
    openGraph: { images: ogImages(home.meta?.image, settings.defaultShareImage, firstTile) },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)

  const [home, settings, allBrands, liveTours, events] = await Promise.all([
    getGlobal('home', locale),
    getGlobal('settings', locale),
    getBrands(locale),
    getVirtualTours(locale, { limit: 3 }),
    getUpcomingEvents(locale, 2),
  ])

  const featuredProjects = published<Project>(home.featuredProjects)
  const projects = featuredProjects.length
    ? featuredProjects
    : await getProjects(locale, { limit: 3 })
  const featuredTours = published<VirtualTour>(home.featuredTours)
  const tours = featuredTours.length ? featuredTours : liveTours

  const appointmentHref = localizedPath(locale, 'appointment')
  const steps = home.generator?.steps ?? []

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: settings.siteName || 'Agence PISE',
          legalName: settings.legalName || undefined,
          url: SITE_URL,
          logo: `${SITE_URL}/brand/pise-logo.png`,
          description: settings.description || undefined,
          foundingDate: settings.foundingYear ? String(settings.foundingYear) : undefined,
          email: settings.contact?.email || undefined,
          telephone: settings.contact?.phone || undefined,
          sameAs: (settings.socials ?? []).map((s) => s.url),
          brand: allBrands.map((b) => ({ '@type': 'Brand', name: b.name })),
        }}
      />

      <Mosaic tiles={home.mosaic ?? []} locale={locale} dict={dict} />

      <section className="container manifesto">
        <div className="manifesto__title">
          {home.manifestoEyebrow ? (
            <span className="pise-eyebrow eyebrow-mute">{home.manifestoEyebrow}</span>
          ) : null}
          <h1 className="manifesto__h1">{home.manifesto || settings.siteName}</h1>
        </div>
        <div className="manifesto__side">
          {home.manifestoLead ? <p className="lead">{home.manifestoLead}</p> : null}
          <div className="actions">
            <Link className="pise-btn" href={appointmentHref}>
              {dict.takeAppointment}
            </Link>
            <Link className="pise-btn pise-btn--outline" href={localizedPath(locale, 'brands')}>
              {dict.brands.ourBrands}
            </Link>
          </div>
        </div>
      </section>

      {home.generator?.title ? (
        <section id="generateur" className="band band--stone">
          <div className="container split split--generator">
            <div className="generator__visual">
              <Img media={home.generator.image} sizes="(min-width: 1100px) 55vw, 100vw" />
            </div>
            <div className="split__text">
              <span className="pise-eyebrow eyebrow-mute">{dict.generator.eyebrow}</span>
              <h2 className="sec-title">{home.generator.title}</h2>
              {home.generator.text ? <p className="body">{home.generator.text}</p> : null}
              {steps.length ? (
                <ol className="steps-list">
                  {steps.map((step, i) => (
                    <li key={step.id ?? i} className="step">
                      <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
                      <span className="body">
                        {step.title}
                        {step.text ? <span className="step__text">{step.text}</span> : null}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}
              <div className="actions actions--center">
                <Link className="pise-btn" href={localizedPath(locale, 'generator')}>
                  {dict.generator.cta}
                </Link>
                <span className="cap">{dict.generator.tool}</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {projects.length ? (
        <section id="realisations" className="container section">
          <div className="section-head">
            <div className="section-head__titles">
              <span className="pise-eyebrow eyebrow-mute">{dict.projects.eyebrow}</span>
              <h2 className="sec-title">{dict.projects.homeTitle}</h2>
            </div>
          </div>
          <div className="project-grid">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                sizes="(min-width: 1100px) 33vw, 100vw"
              />
            ))}
          </div>
          <div>
            <Link className="pise-link" href={localizedPath(locale, 'projects')}>
              {dict.projects.all}
            </Link>
          </div>
        </section>
      ) : null}

      {tours.length ? (
        <section id="espaces" className="band band--ink">
          <div className="container section section--flush">
            <div className="section-head">
              <div className="section-head__titles section-head__titles--narrow">
                <span className="pise-eyebrow eyebrow-sky">{dict.tours.eyebrow}</span>
                <h2 className="sec-title">{dict.tours.homeTitle}</h2>
                <p className="body on-ink-mute">{dict.tours.homeText}</p>
              </div>
              <Link className="pise-link pise-link--light" href={localizedPath(locale, 'tours')}>
                {dict.tours.all}
              </Link>
            </div>
            <div className={`tours-grid tours-grid--${Math.min(tours.length, 3)}`}>
              <TourCard
                tour={tours[0]}
                locale={locale}
                dict={dict}
                large
                sizes="(min-width: 1100px) 66vw, 100vw"
              />
              {tours.length > 1 ? (
                <div className="tours-grid__side">
                  {tours.slice(1, 3).map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      locale={locale}
                      dict={dict}
                      sizes="(min-width: 1100px) 33vw, 100vw"
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <span className="cap on-ink-mute">{dict.tours.producedBy}</span>
          </div>
        </section>
      ) : null}

      <ImrsivoPartner imrsivo={home.imrsivo} locale={locale} dict={dict} id="imrsivo" />

      <section id="rdv" className="band band--stone">
        <div
          className={`container split split--rdv${asMedia(home.appointments?.image) ? '' : ' split--solo'}`}
        >
          {asMedia(home.appointments?.image) ? (
            <div className="rdv__img">
              <Img media={home.appointments?.image} sizes="(min-width: 1100px) 50vw, 100vw" />
            </div>
          ) : null}
          <div className="split__text">
            <span className="pise-eyebrow eyebrow-mute">{dict.appointments.eyebrow}</span>
            <h2 className="sec-title">{home.appointments?.title || dict.takeAppointment}</h2>
            {home.appointments?.text ? <p className="body">{home.appointments.text}</p> : null}
            <ul className="rows">
              {dict.appointments.formats.map((f) => (
                <li key={f.label} className="rdv-row">
                  <span className="body">{f.label}</span>
                  <span className="cap">{f.duration}</span>
                </li>
              ))}
            </ul>
            <div>
              <Link className="pise-btn" href={appointmentHref}>
                {dict.appointments.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {events.length ? (
        <section className="container events">
          <div className="events__intro">
            <span className="pise-eyebrow eyebrow-mute">{dict.events.eyebrow}</span>
            <h2 className="sec-title">{dict.events.title}</h2>
            <p className="body mute">{dict.events.text}</p>
          </div>
          {events.map((event) => {
            const href = event.registrationUrl || `${appointmentHref}?salon=${event.slug ?? ''}`
            const external = /^https?:/.test(href)
            const place = [
              event.city,
              event.venue,
              event.booth ? `${dict.events.booth} ${event.booth}` : null,
            ]
              .filter(Boolean)
              .join(' · ')
            return (
              <a
                key={event.id}
                className="event-card"
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="pise-eyebrow eyebrow-ocean">
                  {formatDateRange(locale, event.startDate, event.endDate)}
                </span>
                <span className="h2">{event.name}</span>
                {place ? <span className="body mute">{place}</span> : null}
                <span className="pise-link">{dict.events.book}</span>
              </a>
            )
          })}
        </section>
      ) : null}

      <section className="newsletter">
        <div className="container newsletter__inner">
          <div className="newsletter__titles">
            <span className="pise-eyebrow eyebrow-mute">{dict.newsletter.eyebrow}</span>
            <h2 className="h2">{home.newsletter?.title || dict.newsletter.eyebrow}</h2>
            {home.newsletter?.text ? <p className="body mute">{home.newsletter.text}</p> : null}
          </div>
          <NewsletterForm
            locale={locale}
            labels={{
              email: dict.newsletter.email,
              placeholder: dict.newsletter.placeholder,
              submit: dict.newsletter.submit,
              consent: dict.newsletter.consent,
              success: dict.newsletter.success,
              error: dict.newsletter.error,
            }}
          />
        </div>
      </section>
    </>
  )
}
