import { getCategoryLabel } from '@/lib/blog-utils'
import type { BlogCategory } from '@/types/blog'

export default function CategoryBadge({ category }: { category: BlogCategory | string }) {
  return (
    <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
      {getCategoryLabel(category)}
    </span>
  )
}
