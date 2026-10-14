'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { Img } from '@/components/ui/Img'

export type ShowcaseSlide = {
  id: string
  url: string
  alt: string
  focalX?: number | null
  focalY?: number | null
  /** « Vue 2 sur 4, moutarde » : nom accessible de la miniature. */
  label: string
}

export type ShowcaseFinish = {
  id: string
  name: string
  swatch: string | null
  /** Photo de la galerie qui montre cette finition. */
  slide: number | null
}

type Props = {
  slides: ShowcaseSlide[]
  finishes: ShowcaseFinish[]
  badge?: string | null
  labels: { gallery: string; finish: string; finishes: string }
  /** Marque, nom, description et référence (rendus côté serveur). */
  head: ReactNode
  /** Boutons, encart pro et lien permanent (rendus côté serveur). */
  actions: ReactNode
}

/**
 * Haut de fiche produit : galerie (défilement au doigt sur mobile, miniatures sur ordinateur)
 * et choix de la finition, qui affiche la photo correspondante.
 */
export function ProductShowcase({ slides, finishes, badge, labels, head, actions }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const initialFinish = Math.max(
    0,
    finishes.findIndex((f) => f.slide === 0),
  )
  const [finish, setFinish] = useState(initialFinish)

  const goTo = useCallback((i: number) => {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
    setIndex(i)
  }, [])

  // La photo visible met à jour la miniature tout de suite, et la finition une fois le défilement
  // terminé (sinon un défilement animé de la vue 1 à la vue 4 sélectionnerait les vues traversées).
  useEffect(() => {
    const el = track.current
    if (!el) return
    let frame = 0
    let idle = 0
    const visible = () => Math.round(el.scrollLeft / Math.max(1, el.clientWidth))
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setIndex(visible()))
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        const f = finishes.findIndex((x) => x.slide === visible())
        if (f >= 0) setFinish(f)
      }, 150)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      window.clearTimeout(idle)
    }
  }, [finishes])

  const current = finishes[finish]

  return (
    <section className="container pv">
      <div className="pv__gallery">
        <div className="pv__stage">
          <div
            ref={track}
            className="pv__track"
            role="region"
            aria-roledescription="carousel"
            aria-label={labels.gallery}
            tabIndex={0}
          >
            {slides.map((slide, i) => (
              <figure key={slide.id} className="pv__slide" aria-label={slide.label}>
                <Img media={slide} sizes="(min-width: 1100px) 58vw, 100vw" priority={i === 0} />
              </figure>
            ))}
          </div>
          {badge ? <span className="pv__badge">{badge}</span> : null}
          {slides.length > 1 ? (
            <span className="pv__count cap" aria-hidden="true">
              {index + 1} / {slides.length}
            </span>
          ) : null}
        </div>
        {slides.length > 1 ? (
          <>
            <div className="pv__dots" aria-hidden="true">
              {slides.map((slide, i) => (
                <span key={slide.id} className={i === index ? 'is-current' : undefined} />
              ))}
            </div>
            <div className="pv__thumbs">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  className="thumb"
                  aria-label={slide.label}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => {
                    goTo(i)
                    const f = finishes.findIndex((x) => x.slide === i)
                    if (f >= 0) setFinish(f)
                  }}
                >
                  <Img media={slide} sizes="140px" alt="" />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="pv__info">
        {head}
        {finishes.length ? (
          <div className="pv__finishes">
            <span className="pise-eyebrow eyebrow-mute" aria-live="polite">
              {current ? `${labels.finish} · ${current.name}` : labels.finishes}
            </span>
            <div className="swatches" role="group" aria-label={labels.finishes}>
              {finishes.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  className="swatch"
                  aria-pressed={i === finish}
                  onClick={() => {
                    setFinish(i)
                    if (f.slide != null) goTo(f.slide)
                  }}
                >
                  <i style={{ background: f.swatch ?? 'var(--sand)' }} />
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {actions}
      </div>
    </section>
  )
}
