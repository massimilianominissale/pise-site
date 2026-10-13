import type { Field, GlobalConfig, Tab } from 'payload'

import { isEditor } from '../access'
import { l } from '../collections/shared'

/** Titre, texte d'introduction et image d'une page de rubrique. Vide : texte par défaut du site. */
const intro = (): Field[] => [
  {
    name: 'title',
    label: l('Titre de la page', 'Page title'),
    type: 'text',
    localized: true,
  },
  {
    name: 'lead',
    label: l('Texte d’introduction', 'Introduction'),
    type: 'textarea',
    localized: true,
  },
  {
    name: 'image',
    label: l('Image', 'Image'),
    type: 'upload',
    relationTo: 'media',
  },
]

const section = (name: string, fr: string, en: string, extra: Field[] = []): Tab => ({
  name,
  label: l(fr, en),
  fields: [...intro(), ...extra],
})

/**
 * Pages de rubrique (fabricants, réalisations, espaces virtuels…) : leur contenu vient des
 * collections, seuls l'introduction et quelques blocs fixes se rédigent ici.
 */
export const Listings: GlobalConfig = {
  slug: 'listings',
  label: l('Pages de rubrique', 'Section pages'),
  admin: {
    group: l('Réglages', 'Settings'),
    description: l(
      'Laissez un champ vide pour garder le texte par défaut du site.',
      'Leave a field empty to keep the default text.',
    ),
  },
  access: { read: () => true, update: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        section('brands', 'Fabricants', 'Brands', [
          {
            name: 'sourcing',
            label: l('Bloc « Sur mesure »', '“Bespoke” block'),
            type: 'group',
            fields: [
              { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true },
              { name: 'text', label: l('Texte', 'Text'), type: 'textarea', localized: true },
              { name: 'image', label: l('Image', 'Image'), type: 'upload', relationTo: 'media' },
            ],
          },
        ]),
        section('projects', 'Réalisations', 'Projects'),
        section('tours', 'Espaces virtuels', 'Virtual spaces'),
        section('news', 'Actualités', 'News'),
        section('generator', 'Générateur', 'Planner'),
        section('appointment', 'Rendez-vous', 'Appointment'),
        section('contact', 'Contact', 'Contact'),
        section('pro', 'Espace pro', 'Trade area'),
      ],
    },
  ],
}
