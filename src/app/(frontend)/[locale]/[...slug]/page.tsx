import { notFound } from 'next/navigation'

/**
 * Adresses sans gabarit : page 404 aux couleurs du site.
 * Accueillera les pages libres du back-office (À propos, mentions légales…) à l'étape suivante.
 */
export default function CatchAll() {
  notFound()
}
