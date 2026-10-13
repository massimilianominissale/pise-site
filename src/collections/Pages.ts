import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { PAGE_BLOCKS } from '../blocks'
import { slugField } from '../fields/slug'
import { draftHooks, GROUPS, l, versioned } from './shared'

/** Pages éditoriales (L'agence, l'équipe, partenariat IMRSIVO, mentions légales…), composées de blocs. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: l('Page', 'Page'), plural: l('Pages', 'Pages') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'parent', '_status', 'updatedAt'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditor,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  fields: [
    { name: 'title', label: l('Titre', 'Title'), type: 'text', required: true, localized: true },
    {
      name: 'layout',
      label: l('Contenu de la page', 'Page content'),
      type: 'blocks',
      blocks: PAGE_BLOCKS,
      localized: false,
    },
    slugField({ localized: true }),
    {
      name: 'parent',
      label: l('Page parente', 'Parent page'),
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
        description: l(
          'Pour une adresse du type /agence/equipe.',
          'For a URL such as /agence/equipe.',
        ),
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
  ],
}
