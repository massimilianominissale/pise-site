'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import { Img } from '@/components/ui/Img'

type Room = { label: string; url: string | null }

type Props = {
  /** Adresse déjà vérifiée côté serveur (voir src/lib/embed.ts). */
  src: string
  title: string
  /** « Showroom Johanson Design · Copenhague » */
  caption?: string | null
  /** « Visite IMRSIVO intégrée » */
  provider?: string | null
  poster?: unknown
  rooms?: Room[]
  /** Charger tout de suite (générateur) ou sur clic (visites 3D, plus lourdes). */
  autoLoad?: boolean
  /**
   * « iframe » : lecteur intégré à la page. « link » : vignette qui ouvre la visite dans un
   * nouvel onglet (pour les outils qui refusent d'être affichés dans un autre site).
   */
  mode?: 'iframe' | 'link'
  labels: {
    enter: string
    fullscreen: string
    exitFullscreen: string
    /** Mode « link » : bouton d'ouverture et mention du nouvel onglet. */
    open?: string
    newTab?: string
  }
  /** Bouton en surimpression, en bas à droite (prise de rendez-vous). */
  action?: ReactNode
  className?: string
}

/**
 * Outil tiers en iframe dans un cadre aux couleurs du site : barre de titre, plein écran,
 * raccourcis vers les pièces. Les visites 3D ne se chargent qu'au clic (poids, cookies tiers).
 */
export function EmbedViewer({
  src,
  title,
  caption,
  provider,
  poster,
  rooms = [],
  autoLoad = false,
  mode = 'iframe',
  labels,
  action,
  className,
}: Props) {
  const frame = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(autoLoad)
  const [room, setRoom] = useState(-1)
  const [fullscreen, setFullscreen] = useState(false)
  const current = room >= 0 ? (rooms[room]?.url ?? src) : src

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frame.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const external = mode === 'link'
  const tab = { target: '_blank', rel: 'noopener noreferrer' } as const

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void frame.current?.requestFullscreen?.()
  }

  return (
    <div className={`viewer${className ? ` ${className}` : ''}`} ref={frame}>
      <div className="viewer__bar">
        <span className="viewer__live" aria-hidden="true" />
        <span className="viewer__title">{caption || title}</span>
        {provider ? <span className="cap viewer__provider">{provider}</span> : null}
        {external ? (
          <a className="pise-btn pise-btn--small pise-btn--light" href={current} {...tab}>
            {labels.open ?? labels.enter} ↗
            {labels.newTab ? <span className="sr-only"> ({labels.newTab})</span> : null}
          </a>
        ) : (
          <button
            type="button"
            className="pise-btn pise-btn--small pise-btn--light"
            onClick={toggleFullscreen}
          >
            {fullscreen ? labels.exitFullscreen : labels.fullscreen}
          </button>
        )}
      </div>
      <div className="viewer__stage">
        {external ? (
          <a className="viewer__poster" href={src} {...tab}>
            <Img media={poster} sizes="100vw" alt="" />
            <span className="tour-card__scrim" />
            <span className="viewer__enter">
              <span className="play" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1f2227"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="pise-eyebrow">{labels.enter} ↗</span>
              {labels.newTab ? <span className="cap viewer__newtab">{labels.newTab}</span> : null}
            </span>
          </a>
        ) : loaded ? (
          <iframe
            key={current}
            src={current}
            title={title}
            className="viewer__frame"
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; clipboard-write"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="viewer__poster" onClick={() => setLoaded(true)}>
            <Img media={poster} sizes="100vw" alt="" />
            <span className="tour-card__scrim" />
            <span className="viewer__enter">
              <span className="play" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1f2227"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="pise-eyebrow">{labels.enter}</span>
            </span>
          </button>
        )}
        {rooms.length > 1 || action ? (
          <div className="viewer__overlay">
            {rooms.length > 1 ? (
              <div className="viewer__rooms" role="group">
                {rooms.map((r, i) =>
                  external ? (
                    <a
                      key={`${r.label}-${i}`}
                      className="pise-chip viewer__room"
                      href={r.url ?? src}
                      {...tab}
                    >
                      {r.label}
                    </a>
                  ) : (
                    <button
                      key={`${r.label}-${i}`}
                      type="button"
                      className="pise-chip viewer__room"
                      aria-pressed={i === room || (room < 0 && i === 0)}
                      onClick={() => {
                        setRoom(i)
                        setLoaded(true)
                      }}
                    >
                      {r.label}
                    </button>
                  ),
                )}
              </div>
            ) : (
              <span />
            )}
            {action}
          </div>
        ) : null}
      </div>
    </div>
  )
}
