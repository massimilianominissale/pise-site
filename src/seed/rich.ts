import { randomBytes } from 'node:crypto'

/**
 * Texte riche (Lexical) écrit en quelques lignes pour les migrations de contenu :
 * paragraphes, intertitres et liens.
 */

type Inline = string | { text: string; url: string }

export type RichNode =
  { kind: 'p'; content: Inline[] } | { kind: 'h'; tag: 'h2' | 'h3'; text: string }

export const p = (...content: Inline[]): RichNode => ({ kind: 'p', content })
export const h2 = (text: string): RichNode => ({ kind: 'h', tag: 'h2', text })
export const h3 = (text: string): RichNode => ({ kind: 'h', tag: 'h3', text })
export const a = (text: string, url: string) => ({ text, url })

const text = (value: string) => ({
  type: 'text',
  text: value,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const element = { format: '', indent: 0, direction: 'ltr' as const }

const inline = (item: Inline) =>
  typeof item === 'string'
    ? text(item)
    : {
        type: 'link',
        version: 3,
        ...element,
        id: randomBytes(12).toString('hex'),
        fields: { linkType: 'custom', url: item.url, newTab: false },
        children: [text(item.text)],
      }

export const toLexical = (nodes: RichNode[]) => ({
  root: {
    type: 'root',
    version: 1,
    ...element,
    children: nodes.map((node) =>
      node.kind === 'h'
        ? { type: 'heading', tag: node.tag, version: 1, ...element, children: [text(node.text)] }
        : {
            type: 'paragraph',
            version: 1,
            ...element,
            textFormat: 0,
            textStyle: '',
            children: node.content.map(inline),
          },
    ),
  },
})

/** Vrai si le texte riche ne contient aucun texte saisi. */
export const isEmptyRich = (value: unknown): boolean =>
  !value || typeof value !== 'object' || !JSON.stringify(value).includes('"text":"')
