import path from 'path'

import { type Ctx, findSeedMedia } from './brands'
import { createLegacyPage, importImage } from './legacy'
import { type LegacyPage, link, outLink, TEAM_PHOTO } from './legacy/agency'
import { type LegacyImage, type Locale, same, type T } from './legacy/brands'
import { standCapture } from './legacy/events'
import { FINISH_IMAGES } from './products'
import { a, p, toLexical } from './rich'
import { forgetUploadedFile } from './uploads'

/**
 * Ajustements du 14/10/2026 demandés par PISE : page IMRSIVO (visites virtuelles et générateur
 * d'aménagement par IA), bloc partenariat de l'accueil, photo d'équipe dans « Parlons de votre
 * projet », menu principal, et réparation des photos de finitions Net Lounge.
 */

const LOCALES: Locale[] = ['fr', 'en', 'it']
const IMAGES_DIR = path.resolve(process.cwd(), 'src/seed/images')

export const MOBILIA_VISUAL: LegacyImage = {
  file: 'imrsivo-mobilia.jpg',
  repo: true,
  alt: {
    fr: 'Générateur d’aménagement Mobilia : un salon composé par l’IA avec des produits du catalogue',
    en: 'Mobilia space planner: a living room staged by AI with catalogue products',
    it: 'Generatore di allestimenti Mobilia: un soggiorno composto dall’IA con prodotti del catalogo',
  },
}

export const STAND_VISUAL = standCapture(
  '2024/12/Capture-decran-2025-05-14-a-16.55.40.png',
  'Nardi',
)

const pick = <V>(locale: Locale, values: Record<Locale, V>): V => values[locale]

export const IMRSIVO_PAGE: LegacyPage = {
  key: 'imrsivo',
  slug: same('imrsivo'),
  title: same('IMRSIVO'),
  layout: (l) => [
    {
      blockType: 'hero',
      eyebrow: pick(l, {
        fr: 'Partenaire technologique',
        en: 'Technology partner',
        it: 'Partner tecnologico',
      }),
      title: pick(l, {
        fr: 'IMRSIVO, le digital au service de vos projets d’aménagement',
        en: 'IMRSIVO: digital tools for your interior projects',
        it: 'IMRSIVO, il digitale al servizio dei vostri progetti d’arredo',
      }),
      lead: pick(l, {
        fr: 'Start-up de Station F, IMRSIVO développe les outils numériques de l’Agence PISE : un générateur d’aménagement qui, grâce à l’intelligence artificielle, met en scène les collections dans vos propres espaces, et des visites virtuelles 360° pour découvrir nos showrooms et nos stands à distance.',
        en: 'A Station F start-up, IMRSIVO builds Agence PISE’s digital tools: a space planner that uses artificial intelligence to stage the collections in your own rooms, and 360° virtual tours to explore our showrooms and stands remotely.',
        it: 'Start-up di Station F, IMRSIVO sviluppa gli strumenti digitali dell’Agence PISE: un generatore di allestimenti che, grazie all’intelligenza artificiale, mette in scena le collezioni nei vostri spazi, e visite virtuali a 360° per scoprire a distanza i nostri showroom e i nostri stand.',
      }),
    },
    {
      blockType: 'mediaText',
      image: MOBILIA_VISUAL,
      imagePosition: 'left',
      title: pick(l, {
        fr: 'Générateur d’aménagement par intelligence artificielle',
        en: 'AI-powered space planner',
        it: 'Generatore di allestimenti con intelligenza artificiale',
      }),
      body: toLexical(
        pick(l, {
          fr: [
            p(
              'Avec Mobilia, l’intelligence artificielle devient un outil d’aménagement. À partir de la photo d’une pièce, le générateur compose en quelques secondes une ambiance réaliste avec de vrais produits de catalogue : canapés, fauteuils, tables, luminaires…',
            ),
            p(
              'On glisse un produit dans la scène, ou l’on décrit simplement l’effet recherché — « ajouter une lumière chaude et douce », « peindre les murs en beige », « vider la pièce » — puis on génère l’ambiance. Le catalogue se filtre par catégorie et par marque, et chaque produit garde ses finitions.',
            ),
            p(
              'Pour les fabricants et les distributeurs, Mobilia s’intègre au site e-commerce : les clients visualisent le mobilier chez eux avant d’acheter, et la marque découvre les produits qui retiennent leur attention.',
            ),
          ],
          en: [
            p(
              'With Mobilia, artificial intelligence becomes a space-planning tool. Starting from a photo of a room, the planner creates a realistic setting in seconds with real catalogue products: sofas, armchairs, tables, lighting…',
            ),
            p(
              'Drag a product into the scene, or simply describe the effect you want — “add warm, soft lighting”, “paint the walls beige”, “empty the room” — then generate the setting. The catalogue can be filtered by category and brand, and every product keeps its finishes.',
            ),
            p(
              'For manufacturers and retailers, Mobilia plugs into the online store: customers see the furniture in their own home before buying, and the brand learns which products catch their eye.',
            ),
          ],
          it: [
            p(
              'Con Mobilia, l’intelligenza artificiale diventa uno strumento di allestimento. Partendo dalla foto di un ambiente, il generatore compone in pochi secondi un’atmosfera realistica con veri prodotti a catalogo: divani, poltrone, tavoli, lampade…',
            ),
            p(
              'Basta trascinare un prodotto nella scena, oppure descrivere l’effetto desiderato — «aggiungere una luce calda e soffusa», «dipingere le pareti di beige», «svuotare la stanza» — e generare l’ambientazione. Il catalogo si filtra per categoria e per marchio, e ogni prodotto mantiene le sue finiture.',
            ),
            p(
              'Per produttori e distributori, Mobilia si integra nel sito e-commerce: i clienti visualizzano gli arredi a casa propria prima dell’acquisto e il marchio scopre quali prodotti attirano la loro attenzione.',
            ),
          ],
        }),
      ),
      cta: outLink(
        'https://mobilia.imrsivo.com/',
        pick(l, { fr: 'Découvrir Mobilia', en: 'Discover Mobilia', it: 'Scopri Mobilia' }),
      ),
    },
    {
      blockType: 'mediaText',
      image: STAND_VISUAL,
      imagePosition: 'right',
      title: pick(l, {
        fr: 'Visites virtuelles 360°',
        en: '360° virtual tours',
        it: 'Visite virtuali a 360°',
      }),
      body: toLexical(
        pick(l, {
          fr: [
            p(
              'Showroom, stand de salon, hôtel ou bureaux aménagés : IMRSIVO transforme un lieu en visite immersive, accessible à toute heure depuis un ordinateur, une tablette, un téléphone ou un casque de réalité virtuelle.',
            ),
            p(
              'Les visites se créent directement dans le navigateur : on importe des photos panoramiques 360°, on relie les espaces entre eux et on ajoute des points interactifs — fiche produit, texte, image, vidéo ou lien vers le site du fabricant. La visite se partage par un simple lien ou s’intègre à un site, en plusieurs langues, avec des statistiques de visite.',
            ),
            p(
              'C’est ainsi que vous pouvez parcourir ',
              a('nos espaces virtuels', '/espaces-virtuels'),
              ' : les stands du Salone del Mobile et les showrooms de nos fabricants.',
            ),
          ],
          en: [
            p(
              'Showroom, trade-fair stand, hotel or furnished offices: IMRSIVO turns a place into an immersive tour, available at any time from a computer, tablet, phone or virtual-reality headset.',
            ),
            p(
              'Tours are built right in the browser: import 360° panoramic photos, link the spaces together and add interactive points — product sheet, text, image, video or link to the manufacturer’s website. The tour is shared with a simple link or embedded in a website, in several languages, with visit statistics.',
            ),
            p(
              'That is how you can explore ',
              a('our virtual spaces', '/en/virtual-spaces'),
              ': our Salone del Mobile stands and our manufacturers’ showrooms.',
            ),
          ],
          it: [
            p(
              'Showroom, stand fieristico, hotel o uffici arredati: IMRSIVO trasforma un luogo in una visita immersiva, accessibile a qualsiasi ora da computer, tablet, smartphone o visore di realtà virtuale.',
            ),
            p(
              'Le visite si creano direttamente nel browser: si importano foto panoramiche a 360°, si collegano gli spazi tra loro e si aggiungono punti interattivi — scheda prodotto, testo, immagine, video o link al sito del produttore. La visita si condivide con un semplice link o si integra in un sito, in più lingue, con le statistiche delle visite.',
            ),
            p(
              'È così che potete esplorare ',
              a('i nostri spazi virtuali', '/it/spazi-virtuali'),
              ': gli stand del Salone del Mobile e gli showroom dei nostri produttori.',
            ),
          ],
        }),
      ),
      cta: outLink(
        'https://web.imrsivo.com/',
        pick(l, {
          fr: 'Découvrir les visites IMRSIVO',
          en: 'Discover IMRSIVO tours',
          it: 'Scopri le visite IMRSIVO',
        }),
      ),
    },
    {
      blockType: 'cta',
      title: pick(l, {
        fr: 'Un projet avec IMRSIVO ?',
        en: 'A project with IMRSIVO?',
        it: 'Un progetto con IMRSIVO?',
      }),
      text: pick(l, {
        fr: 'Fabricant, distributeur ou lieu de vente : faites numériser votre showroom ou intégrez le générateur à votre site. Nous vous mettons en relation.',
        en: 'Manufacturer, retailer or point of sale: have your showroom digitised or add the planner to your website. We’ll put you in touch.',
        it: 'Produttore, distributore o punto vendita: fate digitalizzare il vostro showroom o integrate il generatore nel vostro sito. Vi mettiamo in contatto.',
      }),
      links: [
        {
          link: link(
            '/contact?demande=imrsivo',
            pick(l, { fr: 'Nous contacter', en: 'Contact us', it: 'Contattaci' }),
          ),
        },
        {
          link: link(
            '/espaces-virtuels',
            pick(l, {
              fr: 'Voir nos espaces virtuels',
              en: 'See our virtual spaces',
              it: 'Vedi i nostri spazi virtuali',
            }),
          ),
        },
      ],
    },
  ],
}

const IMRSIVO_TEXT: T = {
  fr: 'Start-up de Station F, IMRSIVO est le partenaire technologique de l’Agence PISE : visites virtuelles 360° de nos showrooms et de nos stands, et générateur d’aménagement par intelligence artificielle.',
  en: 'A Station F start-up, IMRSIVO is Agence PISE’s technology partner: 360° virtual tours of our showrooms and stands, and an AI-powered space planner.',
  it: 'Start-up di Station F, IMRSIVO è il partner tecnologico dell’Agence PISE: visite virtuali a 360° dei nostri showroom e stand, e un generatore di allestimenti con intelligenza artificiale.',
}

/** Menu principal : Fabricants · Réalisations · L'agence · IMRSIVO (bloc de l'accueil). */
const NAV: { url: string; label: T }[] = [
  { url: '/fabricants', label: { fr: 'Fabricants', en: 'Brands', it: 'Marchi' } },
  { url: '/realisations', label: { fr: 'Réalisations', en: 'Projects', it: 'Progetti' } },
  { url: '/agence', label: { fr: 'L’agence', en: 'The agency', it: 'L’agenzia' } },
  { url: '/#imrsivo', label: same('IMRSIVO') },
]

type Row = { id?: string | null }

/** Photos de finitions Net Lounge remplacées par la première lors de l'import initial. */
const repairFinishImages = async (ctx: Ctx) => {
  const { payload, req } = ctx
  for (const file of ['nardi-net-lounge-moutarde.jpg', 'nardi-net-lounge-tourterelle.jpg']) {
    const meta = FINISH_IMAGES[file]
    if (!meta) continue
    const { docs } = await payload.find({
      collection: 'media',
      where: { alt: { equals: meta.alt.fr } },
      locale: 'fr',
      limit: 1,
      depth: 0,
      req,
    })
    const media = docs[0]
    // Seulement si la photo vient toujours de l'import (pas remplacée dans l'administration).
    if (!media?.filename?.startsWith(file.replace(/\.jpg$/, ''))) continue
    forgetUploadedFile(req)
    await payload.update({
      collection: 'media',
      id: media.id,
      data: {},
      filePath: path.join(IMAGES_DIR, file),
      overwriteExistingFiles: true,
      req,
    })
    forgetUploadedFile(req)
    payload.logger.info(`Photo de finition rétablie : ${file}`)
  }
}

const updateHome = async (ctx: Ctx, images: { team: number | null; partner: number[] }) => {
  const { payload, req } = ctx
  const latest = await payload.findGlobal({ slug: 'home', depth: 0, draft: true, req })
  if (latest._status === 'draft') {
    payload.logger.warn(
      'Accueil : modifications non publiées en cours, bloc IMRSIVO et photo d’équipe non appliqués',
    )
    return
  }
  for (const locale of LOCALES) {
    const current = await payload.findGlobal({
      slug: 'home',
      locale,
      fallbackLocale: false,
      depth: 0,
      req,
    })
    await payload.updateGlobal({
      slug: 'home',
      locale,
      depth: 0,
      req,
      data: {
        _status: 'published',
        imrsivo: {
          ...(current.imrsivo ?? {}),
          title: current.imrsivo?.title || 'IMRSIVO × Agence PISE',
          text: IMRSIVO_TEXT[locale],
          images: images.partner,
        },
        appointments: {
          ...(current.appointments ?? {}),
          ...(images.team ? { image: images.team } : {}),
        },
      },
    })
  }
  payload.logger.info('Accueil : bloc IMRSIVO et photo d’équipe mis à jour')
}

const updateNavigation = async (ctx: Ctx) => {
  const { payload, req } = ctx
  let rows: Row[] = []
  for (const locale of LOCALES) {
    const saved = await payload.updateGlobal({
      slug: 'navigation',
      locale,
      depth: 0,
      req,
      data: {
        items: NAV.map((item, i) => ({
          ...(rows[i]?.id ? { id: rows[i].id } : {}),
          link: { type: 'external' as const, url: item.url, label: item.label[locale] },
        })),
      },
    })
    rows = (saved.items ?? []) as Row[]
  }
  payload.logger.info('Menu principal : Fabricants · Réalisations · L’agence · IMRSIVO')
}

export const seedImrsivo = async (ctx: Ctx) => {
  await repairFinishImages(ctx)

  const team = await importImage(ctx, TEAM_PHOTO)
  const mobilia = await importImage(ctx, MOBILIA_VISUAL)
  const stand =
    (await importImage(ctx, STAND_VISUAL)) ?? (await findSeedMedia(ctx, 'nardi-maximo.jpg'))
  await updateHome(ctx, {
    team,
    partner: [mobilia, stand].filter((id): id is number => typeof id === 'number'),
  })
  await updateNavigation(ctx)

  const { created } = await createLegacyPage(ctx, IMRSIVO_PAGE)
  if (created) ctx.payload.logger.info('Page IMRSIVO créée')
}
