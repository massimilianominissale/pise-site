import type { CollectionConfig } from 'payload'

import { fieldIsStaff, isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { draftHooks, GROUPS, l, versioned } from './shared'

/** Actualités : nouveautés, salons, réalisations, vie de l'agence. Premiers jets possibles par l'IA. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: l('Actualité', 'Post'), plural: l('Actualités', 'Posts') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedAt', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAI,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: {
    ...draftHooks,
    beforeChange: [
      // Date de publication renseignée automatiquement à la première publication.
      ({ data }) => {
        if (data?._status === 'published' && !data.publishedAt) {
          return { ...data, publishedAt: new Date().toISOString() }
        }
        return data
      },
    ],
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', label: l('Titre', 'Title'), type: 'text', required: true, localized: true },
    {
      name: 'excerpt',
      label: l('Chapô', 'Lead'),
      type: 'textarea',
      localized: true,
      admin: {
        description: l(
          'La réponse d’abord : l’essentiel en deux phrases.',
          'Answer first: the gist in two sentences.',
        ),
      },
    },
    {
      name: 'cover',
      label: l('Image de couverture', 'Cover image'),
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'body', label: l('Article', 'Body'), type: 'richText', localized: true },
    {
      name: 'categories',
      label: l('Rubriques', 'Categories'),
      type: 'select',
      hasMany: true,
      options: [
        { label: l('Nouveautés', 'New products'), value: 'new-products' },
        { label: l('Salons', 'Trade fairs'), value: 'trade-fairs' },
        { label: l('Réalisations', 'Projects'), value: 'projects' },
        { label: l('Agence', 'Agency'), value: 'agency' },
        { label: l('Inspiration', 'Inspiration'), value: 'inspiration' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'brands',
          label: l('Fabricants cités', 'Brands mentioned'),
          type: 'relationship',
          relationTo: 'brands',
          hasMany: true,
          admin: { width: '50%' },
        },
        {
          name: 'products',
          label: l('Produits cités', 'Products mentioned'),
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'event',
          label: l('Salon lié', 'Related fair'),
          type: 'relationship',
          relationTo: 'events',
          admin: { width: '50%' },
        },
        {
          name: 'project',
          label: l('Réalisation liée', 'Related project'),
          type: 'relationship',
          relationTo: 'projects',
          admin: { width: '50%' },
        },
      ],
    },
    slugField({ localized: true }),
    {
      name: 'publishedAt',
      label: l('Date de publication', 'Publication date'),
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'author',
      label: l('Auteur', 'Author'),
      type: 'relationship',
      relationTo: 'team-members',
      admin: { position: 'sidebar' },
    },
    {
      name: 'ai',
      label: l('Rédaction assistée par IA', 'AI-assisted writing'),
      type: 'group',
      access: { read: fieldIsStaff },
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'generated',
          label: l('Premier jet rédigé par l’IA', 'First draft by AI'),
          type: 'checkbox',
        },
        {
          name: 'sources',
          label: l('Sources utilisées', 'Sources used'),
          type: 'textarea',
          admin: {
            description: l(
              'Renseignées par l’IA, à vérifier à la relecture.',
              'Filled in by the AI, check during review.',
            ),
          },
        },
        {
          name: 'reviewed',
          label: l('Relu et validé par l’équipe', 'Reviewed by the team'),
          type: 'checkbox',
        },
      ],
    },
  ],
}
