/**
 * Adresses intégrées en iframe (visites IMRSIVO, générateur Mobilia).
 * Seules les adresses https sont acceptées ; si des domaines sont listés dans
 * Réglages › Intégrations, l'adresse doit appartenir à l'un d'eux.
 */
export const safeEmbedUrl = (
  url: string | null | undefined,
  allowedOrigins: string[],
): string | null => {
  if (!url) return null
  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:') return null
  if (!allowedOrigins.length) return parsed.toString()
  const allowed = allowedOrigins.some((origin) => {
    try {
      const o = new URL(origin.trim())
      return o.origin === parsed.origin
    } catch {
      return false
    }
  })
  return allowed ? parsed.toString() : null
}
