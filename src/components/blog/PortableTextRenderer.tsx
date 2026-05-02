'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import ArticleLead from './ArticleLead'
import InfoBox from './InfoBox'
import ArticleTable from './ArticleTable'
import ArticleQuote from './ArticleQuote'
import NumberedSteps from './NumberedSteps'
import ArticleFAQ from './ArticleFAQ'
import { getImageUrl } from '@/lib/sanity.image'
import Image from 'next/image'

interface Props { content: any[]; slug: string }

export function PortableTextRenderer({ content, slug }: Props) {
  let isFirstParagraph = true

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => {
        const text = extractText(children)
        if (isFirstParagraph && text.length > 0) {
          isFirstParagraph = false
          return <ArticleLead>{children}</ArticleLead>
        }
        return <p className="text-muted leading-relaxed mb-6">{children}</p>
      },
      h2: ({ children }) => {
        const id = slugify(extractText(children))
        return <h2 id={id} className="text-2xl font-semibold text-foreground mt-12 mb-4 scroll-mt-28">{children}</h2>
      },
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
      ),
      blockquote: ({ children }) => <ArticleQuote>{children}</ArticleQuote>,
    },
    list: {
      bullet: ({ children }) => <ul className="space-y-2 mb-6 ml-6">{children}</ul>,
      number: ({ children }) => <ol className="space-y-2 mb-6 ml-6 list-decimal">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" />
          <span className="text-muted">{children}</span>
        </li>
      ),
      number: ({ children }) => <li className="text-muted">{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      underline: ({ children }) => <span className="underline">{children}</span>,
      link: ({ children, value }) => (
        <a href={value?.href} target="_blank" rel="noopener noreferrer"
          className="text-foreground underline decoration-brand decoration-2 underline-offset-4 hover:bg-brand-light transition-colors">
          {children}
        </a>
      ),
    },
    types: {
      image: ({ value }) => {
        const url = getImageUrl(value, 800)
        if (!url) return null
        return (
          <figure className="my-8">
            <Image src={url} alt={value.alt || ''} width={800} height={450} className="rounded-xl w-full" />
            {value.caption && (
              <figcaption className="text-sm text-muted text-center mt-3">{value.caption}</figcaption>
            )}
          </figure>
        )
      },
      infoBox: ({ value }) => (
        <InfoBox variant={value.variant || 'tip'} title={value.title}>
          {value.content ? <PortableText value={value.content} /> : <p>{value.text || ''}</p>}
        </InfoBox>
      ),
      articleTable: ({ value }) => {
        const headers = value.headers || []
        const columns = headers.map((h: string, i: number) => ({ key: 'col' + i, label: h, highlight: i === headers.length - 1 }))
        const rows = (value.rows || []).map((r: any) => {
          const row: Record<string, string> = {}
          const cells = r.cells || []
          headers.forEach((h: string, i: number) => { row['col' + i] = cells[i] || '' })
          return row
        })
        return <ArticleTable columns={columns} rows={rows} />
      },
      numberedSteps: ({ value }) => (
        <NumberedSteps steps={(value.steps || []).map((s: any) => ({ title: s.title, description: s.description || '' }))} />
      ),
      faq: ({ value }) => (
        <ArticleFAQ faqs={(value.items || []).map((item: any) => ({ question: item.question, answer: typeof item.answer === 'string' ? item.answer : extractPortableText(item.answer) }))} />
      ),
    },
  }

  return <div className="portable-text"><PortableText value={content} components={components} /></div>
}

function extractText(children: any): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children?.props?.children) return extractText(children.props.children)
  return String(children || '')
}

function extractPortableText(blocks: any[]): string {
  if (!blocks) return ''
  return blocks.map((block: any) => {
    if (block._type === 'block' && block.children) return block.children.map((child: any) => child.text || '').join('')
    return ''
  }).join('\n')
}

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\̀-\ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
