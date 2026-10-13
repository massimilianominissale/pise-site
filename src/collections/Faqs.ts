import type { CollectionConfig } from 'payload'

import { anyone, isEditor, isEditorOrAI } from '../access'
import { GROUPS, l } from './shared'

/**
 * Questions fréquentes, réutilisées par les fiches, le chatbot et les données
 * structurées FAQPage. Les questions sans réponse du chatbot pourront y être ajoutées.
 */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: l('Question fréquente', 'FAQ'), plural: l('Questions fréquentes', 'FAQs') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'question',
    defaultColumns: ['question', 'topic', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: isEditorOrAI,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'question',
      label: l('Question', 'Question'),
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      label: l('Réponse', 'Answer'),
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: l(
          'Réponse directe en premier, en deux ou trois phrases.',
          'Direct answer first, two or three sentences.',
        ),
      },
    },
    {
      name: 'topic',
      label: l('Thème', 'Topic'),
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: l('Général', 'General'), value: 'general' },
        { label: l('Produits', 'Products'), value: 'products' },
        { label: l('Livraison et délais', 'Delivery'), value: 'delivery' },
        { label: l('Espace pro', 'Pro area'), value: 'pro' },
        {
          label: l('Rendez-vous et showrooms', 'Appointments and showrooms'),
          value: 'appointments',
        },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'brands',
      label: l('Fabricants concernés', 'Related brands'),
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
    },
    { name: 'order', label: l('Ordre', 'Order'), type: 'number', admin: { position: 'sidebar' } },
  ],
}
