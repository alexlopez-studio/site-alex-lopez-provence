'use client'

import TableOfContents from './TableOfContents'
import SidebarCTA from './SidebarCTA'
import ShareButtons from './ShareButtons'

export default function ArticleSidebar({ url, title }: { url: string; title: string }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 flex flex-col gap-6">
        <TableOfContents />
        <SidebarCTA />
        <ShareButtons url={url} title={title} layout="sidebar" />
      </div>
    </aside>
  )
}
