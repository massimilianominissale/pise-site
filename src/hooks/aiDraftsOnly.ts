import type { CollectionBeforeOperationHook } from 'payload'

import { hasRole } from '../access'

/**
 * Règle « l'IA ne publie jamais » : quoi que demande un compte au rôle « ai »,
 * la création ou la modification est enregistrée comme un nouveau brouillon.
 * La version publiée reste en ligne, intacte, jusqu'à ce qu'un humain publie.
 */
export const aiDraftsOnly: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if ((operation === 'create' || operation === 'update') && hasRole(req, 'ai')) {
    const data = (args as { data?: Record<string, unknown> }).data
    return {
      ...args,
      draft: true,
      publishAllLocales: false,
      data: data ? { ...data, _status: 'draft' } : data,
    }
  }
  return args
}
