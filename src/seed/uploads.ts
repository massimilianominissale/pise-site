import type { PayloadRequest } from 'payload'

/**
 * Le stockage Vercel Blob mémorise dans la requête le PREMIER fichier envoyé
 * (`req.context._payloadCloudStorage`) et le renvoie lors de toute modification ultérieure
 * d'un média sans nouveau fichier (traduction du texte alternatif, par exemple).
 * Une migration partage une seule requête : sans ce nettoyage, chaque photo enregistrée après
 * la première serait remplacée par celle-ci. À appeler avant chaque création ou modification
 * de média dans une migration ou un script.
 */
export const forgetUploadedFile = (req?: PayloadRequest) => {
  if (req?.context && '_payloadCloudStorage' in req.context) delete req.context._payloadCloudStorage
}
