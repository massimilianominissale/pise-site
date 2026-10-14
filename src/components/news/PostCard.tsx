import Link from 'next/link'

import { Img } from '@/components/ui/Img'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { docHref } from '@/lib/links'
import type { Post } from '@/payload-types'

export const postDate = (post: Pick<Post, 'publishedAt' | 'createdAt'>, locale: Locale) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(new Date(post.publishedAt ?? post.createdAt))

/** Carte d'actualité : photo, catégorie et date, titre, chapô. */
export function PostCard({
  post,
  locale,
  dict,
  large,
  sizes,
}: {
  post: Post
  locale: Locale
  dict: Dictionary
  large?: boolean
  sizes: string
}) {
  const category = post.categories?.[0] ? dict.newsPage.categories[post.categories[0]] : null
  return (
    <Link
      className={`post-card${large ? ' post-card--large' : ''}`}
      href={docHref(locale, 'posts', post) ?? '#'}
    >
      <div className="post-card__img">
        <Img media={post.cover} sizes={sizes} />
      </div>
      <div className="post-card__text">
        <span className="pise-eyebrow eyebrow-mute">
          {[category, postDate(post, locale)].filter(Boolean).join(' · ')}
        </span>
        <span className={large ? 'h2' : 'h3'}>{post.title}</span>
        {post.excerpt ? <p className="body mute post-card__excerpt">{post.excerpt}</p> : null}
        {large ? <span className="pise-link">{dict.newsPage.read}</span> : null}
      </div>
    </Link>
  )
}
