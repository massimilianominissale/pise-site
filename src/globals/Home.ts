import type { GlobalConfig } from 'payload'

import { isEditor } from '../access'
import { l } from '../collections/shared'
import { linkField } from '../fields/link'

/** Page d'accueil : la mosaïque et les sections qui la suivent, dans l'ordre des maquettes. */
export const Home: GlobalConfig = {
  slug: 'home',
  label: l('Accueil', 'Home'),
  admin: { group: l('Réglages', 'Settings') },
  access: {
    read: () => true,
    update: isEditor,
  },
  versions: { drafts: true, max: 50 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: l('Mosaïque', 'Mosaic'),
          fields: [
            {
              name: 'mosaic',
              label: l('Tuiles de la mosaïque', 'Mosaic tiles'),
              type: 'array',
              minRows: 1,
              maxRows: 16,
              labels: { singular: l('Tuile', 'Tile'), plural: l('Tuiles', 'Tiles') },
              admin: {
                description: l(
                  'L’ordre des tuiles est celui de la grille, de gauche à droite et de haut en bas.',
                  'Tiles fill the grid left to right, top to bottom.',
                ),
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
                  type: 'row',
                  fields: [
                    {
                      name: 'brand',
                      label: l('Fabricant', 'Brand'),
                      type: 'relationship',
                      relationTo: 'brands',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'range',
                      label: l('Collection', 'Collection'),
                      type: 'relationship',
                      relationTo: 'ranges',
                      admin: {
                        width: '50%',
                        description: l(
                          'Pour mémoire : non affichée sur la tuile.',
                          'For reference only: not shown on the tile.',
                        ),
                      },
                    },
                  ],
                },
                {
                  name: 'label',
                  label: l('Étiquette (tuile sans fabricant)', 'Label (tile without a brand)'),
                  type: 'text',
                  localized: true,
                  admin: {
                    description: l(
                      'L’étiquette affiche le nom du fabricant. Ce texte n’apparaît que si aucun fabricant n’est choisi.',
                      'The label shows the brand name. This text only appears when no brand is selected.',
                    ),
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'size',
                      label: l('Taille', 'Size'),
                      type: 'select',
                      defaultValue: '1x1',
                      options: [
                        { label: l('1 × 1', '1 × 1'), value: '1x1' },
                        { label: l('2 × 1 (large)', '2 × 1 (wide)'), value: '2x1' },
                        { label: l('1 × 2 (haute)', '1 × 2 (tall)'), value: '1x2' },
                        { label: l('2 × 2 (grande)', '2 × 2 (large)'), value: '2x2' },
                      ],
                      admin: { width: '34%' },
                    },
                    {
                      name: 'isNew',
                      label: l('Badge « Nouveau »', '“New” badge'),
                      type: 'checkbox',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'pulse',
                      label: l('Pastille animée', 'Pulsing dot'),
                      type: 'checkbox',
                      admin: { width: '33%' },
                    },
                  ],
                },
                linkField({ name: 'link', withLabel: false }),
              ],
            },
          ],
        },
        {
          label: l('Sections', 'Sections'),
          fields: [
            {
              name: 'manifestoEyebrow',
              label: l('Surtitre du manifeste', 'Manifesto eyebrow'),
              type: 'text',
              localized: true,
            },
            {
              name: 'manifesto',
              label: l('Manifeste (titre principal de la page)', 'Manifesto (main page heading)'),
              type: 'textarea',
              localized: true,
            },
            {
              name: 'manifestoLead',
              label: l('Texte sous le manifeste', 'Manifesto lead'),
              type: 'textarea',
              localized: true,
            },
            {
              name: 'featuredBrands',
              label: l('Fabricants affichés', 'Brands shown'),
              type: 'relationship',
              relationTo: 'brands',
              hasMany: true,
              // Bloc « Les fabricants » retiré de l'accueil le 22/10 : champ conservé mais masqué.
              admin: { hidden: true },
            },
            {
              name: 'generator',
              label: l('Générateur de visuels', 'Visual generator'),
              type: 'group',
              fields: [
                { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true },
                { name: 'text', label: l('Texte', 'Text'), type: 'textarea', localized: true },
                { name: 'image', label: l('Image', 'Image'), type: 'upload', relationTo: 'media' },
                {
                  name: 'steps',
                  label: l('Étapes', 'Steps'),
                  type: 'array',
                  labels: { singular: l('Étape', 'Step'), plural: l('Étapes', 'Steps') },
                  maxRows: 4,
                  fields: [
                    {
                      name: 'title',
                      label: l('Titre', 'Title'),
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    { name: 'text', label: l('Texte', 'Text'), type: 'textarea', localized: true },
                  ],
                },
              ],
            },
            {
              name: 'featuredProjects',
              label: l('Réalisations affichées', 'Projects shown'),
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              maxRows: 6,
            },
            {
              name: 'featuredTours',
              label: l('Espaces virtuels affichés', 'Virtual tours shown'),
              type: 'relationship',
              relationTo: 'virtual-tours',
              hasMany: true,
              maxRows: 3,
            },
            {
              name: 'imrsivo',
              label: l('Partenariat IMRSIVO', 'IMRSIVO partnership'),
              type: 'group',
              fields: [
                { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true },
                { name: 'text', label: l('Texte', 'Text'), type: 'textarea', localized: true },
                {
                  name: 'images',
                  label: l('Images', 'Images'),
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                },
              ],
            },
            {
              name: 'appointments',
              label: l('Rendez-vous', 'Appointments'),
              type: 'group',
              fields: [
                { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true },
                { name: 'text', label: l('Texte', 'Text'), type: 'textarea', localized: true },
                { name: 'image', label: l('Image', 'Image'), type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'newsletter',
              label: l('Newsletter', 'Newsletter'),
              type: 'group',
              fields: [
                { name: 'title', label: l('Titre', 'Title'), type: 'text', localized: true },
                { name: 'text', label: l('Texte', 'Text'), type: 'textarea', localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
