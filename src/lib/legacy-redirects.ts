/**
 * Anciennes adresses du site WordPress (agencepise.fr/index.php/…) → nouvelles pages.
 * Redirections permanentes, pour garder le référencement et les liens existants
 * le jour où le domaine pointe vers le nouveau site.
 */

/** Fiches « portfolio » de l'ancien site → fiches fabricants (et collections). */
const PORTFOLIO: Record<string, string> = {
  burotime: '/fabricants/burotime',
  maffei: '/fabricants/maffei',
  'noon-by-johanson': '/fabricants/johanson-design/noon',
  'johanson-design-decibel-cloned': '/fabricants/johanson-design/decibel',
  'milla-milli': '/fabricants/milla-et-milli',
  axolight: '/fabricants/axolight',
  fabbian: '/fabricants/fabbian',
  'mobilier-johanson-design': '/fabricants/johanson-design',
  kymo: '/fabricants/kymo',
  'chaises-et-tables-de-jardin-et-de-collectivites-dinterieur-et-dexterieur-nardi-outdoor':
    '/fabricants/nardi',
  system180: '/fabricants/system180',
}

/** Articles « Salons » (/index.php/AAAA/MM/JJ/slug/) → fiches de salon. */
const POSTS: Record<string, string> = {
  'maisonobjet-2023': 'maison-objet-2024',
  'milan-2023': 'stockholm-furniture-fair-2024',
  'orgatec-2024-cloned': 'salone-del-mobile-2024',
  '5-3-days-of-design-copenhagen': '3-days-of-design-2024',
  '6-equip-hotel': 'equip-hotel-2024',
  '7-paris-design-week': 'paris-design-week-2024',
  '8-orgatec': 'orgatec-2024',
  '9-maisonobjet-2025': 'maison-objet-2025',
  '11-workspace-2025': 'workspace-2025',
  '10-i-saloni-salon-du-meuble-milan': 'salone-del-mobile-2025',
  '3-days-of-design': '3-days-of-design-2025',
}

/** Pages de l'ancien site. */
const PAGES: Record<string, string> = {
  mobilier: '/fabricants',
  luminaires: '/fabricants',
  'be-architect-sur-mesure': '/contact?demande=sourcing',
  'nos-valeurs-nos-services': '/agence',
  tarifs: '/pro',
  'tarifs/tarifs-prives': '/pro',
  contact: '/contact',
  'contact/lequipe': '/agence/equipe',
  'mentions-legales': '/mentions-legales',
  'politique-de-confidentialite': '/confidentialite',
  'comment-utiliser-le-show-room-virtuel': '/espaces-virtuels',
  'evenements-passes': '/agence/salons',
  'tous-les-evenements': '/agence/salons',
  'jeu-concours-instagram': '/',
  'accueil-agence-pise': '/',
}

export type LegacyRedirect = { source: string; destination: string; permanent: true }

const redirect = (source: string, destination: string): LegacyRedirect => ({
  source,
  destination,
  permanent: true,
})

export const legacyRedirects = (): LegacyRedirect[] => [
  ...Object.entries(PAGES).map(([from, to]) => redirect(`/index.php/${from}`, to)),
  ...Object.entries(PORTFOLIO).map(([from, to]) => redirect(`/index.php/portfolio/${from}`, to)),
  ...Object.entries(POSTS).map(([from, to]) =>
    redirect(
      `/index.php/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/${from}`,
      `/agence/salons/${to}`,
    ),
  ),
  // Catalogues en ligne (flipbooks) et le reste de l'ancien site : rubriques les plus proches.
  redirect('/index.php/3d-flip-book/:path*', '/fabricants'),
  redirect('/index.php/portfolio/:path*', '/fabricants'),
  redirect('/index.php/:path*', '/'),
]
