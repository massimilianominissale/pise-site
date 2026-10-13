import type { GlobalConfig } from 'payload'

import { isEditor } from '../access'
import { l } from '../collections/shared'
import { linkField } from '../fields/link'

/** Pied de page : bandeau IMRSIVO, colonnes de liens, mentions légales. */
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: l('Pied de page', 'Footer'),
  admin: { group: l('Réglages', 'Settings') },
  access: { read: () => true, update: isEditor },
  fields: [
    {
      name: 'banner',
      label: l('Bandeau du haut', 'Top banner'),
      type: 'group',
      fields: [
        {
          name: 'text',
          label: l('Texte', 'Text'),
          type: 'text',
          localized: true,
          defaultValue: 'Visitez nos espaces virtuels',
        },
        {
          name: 'credit',
          label: l('Mention', 'Credit'),
          type: 'text',
          localized: true,
          defaultValue: 'Réalisés par IMRSIVO',
        },
        linkField({ name: 'link', withLabel: false }),
      ],
    },
    {
      name: 'tagline',
      label: l('Phrase sous le logo', 'Tagline'),
      type: 'textarea',
      localized: true,
    },
    {
      name: 'columns',
      label: l('Colonnes de liens', 'Link columns'),
      type: 'array',
      labels: { singular: l('Colonne', 'Column'), plural: l('Colonnes', 'Columns') },
      maxRows: 4,
      fields: [
        {
          name: 'title',
          label: l('Titre', 'Title'),
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'links',
          label: l('Liens', 'Links'),
          type: 'array',
          labels: { singular: l('Lien', 'Link'), plural: l('Liens', 'Links') },
          fields: [linkField({ name: 'link', required: true })],
        },
      ],
    },
    {
      name: 'legalLinks',
      label: l('Liens légaux', 'Legal links'),
      type: 'array',
      labels: { singular: l('Lien', 'Link'), plural: l('Liens', 'Links') },
      fields: [linkField({ name: 'link', required: true })],
    },
  ],
}
