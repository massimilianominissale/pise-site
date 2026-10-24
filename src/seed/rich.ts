import { randomBytes } from 'node:crypto'

/**
 * Texte riche (Lexical) écrit en quelques lignes pour les migrations de contenu :
 * paragraphes, intertitres et liens.
 */

export type Inline = string | { text: string; url: string } | { text: string; bold: true }

export type RichNode =
  | { kind: 'p'; content: Inline[] }
  | { kind: 'h'; tag: 'h2' | 'h3'; text: string }
  | { kind: 'ul'; items: Inline[][] }

export const p = (...content: Inline[]): RichNode => ({ kind: 'p', content })
export const h2 = (text: string): RichNode => ({ kind: 'h', tag: 'h2', text })
export const h3 = (text: string): RichNode => ({ kind: 'h', tag: 'h3', text })
export const a = (text: string, url: string) => ({ text, url })
/** Texte en gras. */
export const b = (text: string) => ({ text, bold: true as const })
/** Liste à puces : un tableau d'éléments en ligne par puce. */
export const ul = (...items: Inline[][]): RichNode => ({ kind: 'ul', items })

const text = (value: string, format = 0) => ({
  type: 'text',
  text: value,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const element = { format: '', indent: 0, direction: 'ltr' as const }

const inline = (item: Inline) =>
  typeof item === 'string'
    ? text(item)
    : 'bold' in item
      ? text(item.text, 1)
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
        : node.kind === 'ul'
          ? {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              start: 1,
              version: 1,
              ...element,
              children: node.items.map((content, i) => ({
                type: 'listitem',
                value: i + 1,
                version: 1,
                ...element,
                children: content.map(inline),
              })),
            }
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
