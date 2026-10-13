import type { GlobalConfig } from 'payload'

import { isEditor } from '../access'
import { l } from '../collections/shared'
import { linkField } from '../fields/link'

/** Menu principal et actions de l'en-tête. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: l('Navigation', 'Navigation'),
  admin: { group: l('Réglages', 'Settings') },
  access: { read: () => true, update: isEditor },
  fields: [
    {
      name: 'items',
      label: l('Entrées du menu', 'Menu items'),
      type: 'array',
      maxRows: 7,
      labels: { singular: l('Entrée', 'Item'), plural: l('Entrées', 'Items') },
      fields: [linkField({ name: 'link', required: true })],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'proLabel',
          label: l('Texte du lien Espace pro', 'Pro area label'),
          type: 'text',
          localized: true,
          defaultValue: 'Espace pro',
          admin: { width: '50%' },
        },
        {
          name: 'appointmentLabel',
          label: l('Texte du bouton Rendez-vous', 'Appointment button label'),
          type: 'text',
          localized: true,
          defaultValue: 'Rendez-vous',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
