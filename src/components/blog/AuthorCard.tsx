import type { BlogPost } from '@/types/blog'
import { formatDate, getAuthorInitials } from '@/lib/blog-utils'
import { Calendar, Clock } from 'lucide-react'

export default function AuthorCard({ post }: { post: BlogPost }) {
  const displayTime = post.readingTime || post.readTime
  const hasRichAuthor = !!post.authorInfo
  const initials = hasRichAuthor ? post.authorInfo!.initials : getAuthorInitials(post.author)
  const name = hasRichAuthor ? post.authorInfo!.name : post.author
  const role = hasRichAuthor ? post.authorInfo!.role : undefined

  return (
    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand" aria-hidden>
        <span className="text-sm font-semibold text-white">{initials}</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted">
        <span className="font-semibold text-foreground">{name}</span>
        {role && (
          <><span className="hidden sm:inline" aria-hidden>·</span><span>{role}</span></>
        )}
        <span className="hidden sm:inline" aria-hidden>·</span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </span>
        {displayTime && (
          <><span className="hidden sm:inline" aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {displayTime} min de lecture
          </span></>
        )}
      </div>
    </div>
  )
}
