import type { ReactNode } from 'react'

export default function ArticleQuote({ children, author }: { children: ReactNode; author?: string }) {
  return (
    <blockquote className="my-10 text-center">
      <p className="text-[22px] italic leading-[1.6] text-foreground md:text-[26px]">
        {'« '}{children}{' »'}
      </p>
      {author && (
        <footer className="mt-3 text-[13px] font-medium text-muted">— {author}</footer>
      )}
    </blockquote>
  )
}
