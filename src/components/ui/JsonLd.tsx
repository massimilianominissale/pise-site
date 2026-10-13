/** Données structurées schema.org (moteurs de recherche et moteurs IA). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // « < » échappé : le contenu saisi dans le back-office ne peut pas fermer la balise script.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
