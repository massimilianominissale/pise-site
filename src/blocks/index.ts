import type { Block } from 'payload'

import { linkField } from '../fields/link'
import { l } from '../collections/shared'

/** Blocs de mise en page des pages éditoriales. La liste s'enrichira avec les gabarits. */

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: l('En-tête', 'Hero'), plural: l('En-têtes', 'Heroes') },
  fields: [
    { name: 'eyebrow', label: l('Surtitre', 'Eyebrow'), type: 'text', localized: true },
    { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true, required: true },
    { name: 'lead', label: l('Chapô', 'Lead'), type: 'textarea', localized: true },
    { name: 'image', label: l('Image', 'Image'), type: 'upload', relationTo: 'media' },
    linkField({ name: 'cta', label: l('Bouton', 'Button') }),
  ],
}

export const ContentBlock: Block = {
  slug: 'content',
  labels: { singular: l('Texte', 'Text'), plural: l('Textes', 'Texts') },
  fields: [{ name: 'body', label: l('Texte', 'Text'), type: 'richText', localized: true }],
}

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: {
    singular: l('Image et texte', 'Media and text'),
    plural: l('Images et textes', 'Media and text'),
  },
  fields: [
    {
      name: 'image',
      label: l('Image', 'Image'),
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imagePosition',
      label: l('Position de l’image', 'Image position'),
      type: 'radio',
      defaultValue: 'left',
      options: [
        { label: l('À gauche', 'Left'), value: 'left' },
        { label: l('À droite', 'Right'), value: 'right' },
      ],
      admin: { layout: 'horizontal' },
    },
    { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true },
    { name: 'body', label: l('Texte', 'Text'), type: 'richText', localized: true },
    linkField({ name: 'cta', label: l('Lien', 'Link') }),
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: l('Galerie', 'Gallery'), plural: l('Galeries', 'Galleries') },
  fields: [
    {
      name: 'images',
      label: l('Images', 'Images'),
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: l('Questions fréquentes', 'FAQ'), plural: l('Questions fréquentes', 'FAQ') },
  fields: [
    { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true },
    {
      name: 'faqs',
      label: l('Questions', 'Questions'),
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      required: true,
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: {
    singular: l('Appel à l’action', 'Call to action'),
    plural: l('Appels à l’action', 'Calls to action'),
  },
  fields: [
    { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true, required: true },
    { name: 'text', label: l('Texte', 'Text'), type: 'textarea', localized: true },
    {
      name: 'links',
      label: l('Boutons', 'Buttons'),
      type: 'array',
      labels: { singular: l('Bouton', 'Button'), plural: l('Boutons', 'Buttons') },
      maxRows: 2,
      fields: [linkField({ name: 'link' })],
    },
  ],
}

export const PAGE_BLOCKS: Block[] = [
  HeroBlock,
  ContentBlock,
  MediaTextBlock,
  GalleryBlock,
  FaqBlock,
  CtaBlock,
]
