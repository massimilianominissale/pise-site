import type { CollectionConfig } from 'payload'

// Comptes du back-office (équipe PISE). Les rôles détaillés
// (administrateur, éditeur, IA) arrivent avec le modèle de contenu.
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { fr: 'Utilisateur', en: 'User' },
    plural: { fr: 'Utilisateurs', en: 'Users' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: { fr: 'Nom', en: 'Name' },
      type: 'text',
    },
  ],
}
