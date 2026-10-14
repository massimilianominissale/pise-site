import Image from 'next/image'

import type { Media } from '@/payload-types'

/** Une relation vers une image peut arriver sous forme d'identifiant (profondeur insuffisante) : on l'ignore. */
export const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value && (value as Media).url
    ? (value as Media)
    : null

/**
 * Quand l'adresse du site est renseignée, Payload renvoie des adresses absolues : on les rend
 * relatives pour que l'optimiseur d'images lise le fichier sur le même serveur.
 */
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')
const localSrc = (url: string) =>
  SERVER_URL && url.startsWith(`${SERVER_URL}/`) ? url.slice(SERVER_URL.length) : url

type Props = {
  media: unknown
  /** Largeurs d'affichage, pour que le navigateur charge la bonne taille. */
  sizes: string
  className?: string
  priority?: boolean
  /** Remplace le texte alternatif saisi (rare : image décorative dans un lien déjà nommé). */
  alt?: string
}

/**
 * Image du back-office, recadrée pour remplir son conteneur (qui fixe le format).
 * Le point focal choisi dans l'administration sert de centre de recadrage.
 */
export function Img({ media, sizes, className, priority, alt }: Props) {
  const image = asMedia(media)
  if (!image?.url) return null
  const position =
    image.focalX != null && image.focalY != null ? `${image.focalX}% ${image.focalY}%` : undefined
  return (
    <Image
      src={localSrc(image.url)}
      alt={alt ?? image.alt ?? ''}
      fill
      sizes={sizes}
      priority={priority}
      className={className ? `cover ${className}` : 'cover'}
      style={position ? { objectPosition: position } : undefined}
    />
  )
}
