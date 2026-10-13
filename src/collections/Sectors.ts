import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { slugField } from '../fields/slug'
import { GROUPS, l } from './shared'

/** Secteurs d'activité : bureaux, hôtellerie, éducation, coworking, restauration, outdoor. */
export const Sectors: CollectionConfig = {
  slug: 'sectors',
  labels: { singular: l('Secteur', 'Sector'), plural: l('Secteurs', 'Sectors') },
  admin: {
    group: GROUPS.catalogue,
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
  },
  access: {
    read: anyone,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: l('Nom', 'Name'), type: 'text', required: true, localized: true },
    {
      name: 'description',
      label: l('Description', 'Description'),
      type: 'textarea',
      localized: true,
    },
    { name: 'image', label: l('Image', 'Image'), type: 'upload', relationTo: 'media' },
    slugField({ from: 'name' }),
    { name: 'order', label: l('Ordre', 'Order'), type: 'number', admin: { position: 'sidebar' } },
  ],
}
