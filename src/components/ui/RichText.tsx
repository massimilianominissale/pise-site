import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as Lexical,
} from '@payloadcms/richtext-lexical/react'

import type { Locale } from '@/i18n/config'
import { docHref } from '@/lib/links'

type Props = { data: unknown; locale: Locale; className?: string }

/** Texte riche du back-office. Les liens internes pointent vers l'adresse publique dans la bonne langue. */
export function RichText({ data, locale, className }: Props) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const doc = linkNode.fields.doc
        if (!doc) return '#'
        return docHref(locale, doc.relationTo, doc.value) ?? '#'
      },
    }),
  })
  return (
    <Lexical
      className={className ? `rich-text ${className}` : 'rich-text'}
      data={data as SerializedEditorState}
      converters={converters}
    />
  )
}
