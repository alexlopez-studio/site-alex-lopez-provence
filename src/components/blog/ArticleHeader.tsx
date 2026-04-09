import type { BlogPost } from '@/types/blog'
import Image from 'next/image'
import Breadcrumb from './Breadcrumb'
import CategoryBadge from './CategoryBadge'
import AuthorCard from './AuthorCard'

export default function ArticleHeader({ post }: { post: BlogPost }) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <Breadcrumb />
      <CategoryBadge category={post.category} />
      <h1 className="mt-6 text-3xl font-extrabold leading-tight text-foreground md:text-4xl lg:text-5xl">
        {post.title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        {post.excerpt}
      </p>
      <AuthorCard post={post} />
      {post.coverImage && (
        <div className="mt-10">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={630}
            priority
            className="w-full rounded-2xl object-cover"
          />
        </div>
      )}
    </header>
  )
}
