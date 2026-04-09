export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const html = { __html: JSON.stringify(data) }
  return <script type="application/ld+json" dangerouslySetInnerHTML={html} />
}
