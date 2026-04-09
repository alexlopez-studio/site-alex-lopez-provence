import type { FAQ } from '@/types/blog'

export default function ArticleFAQ({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null
  return (
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-semibold text-foreground">
        Questions fréquentes
      </h2>
      <dl className="mt-8 space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-2xl border border-border bg-white p-6">
            <dt className="text-base font-semibold text-foreground">{faq.question}</dt>
            <dd className="mt-2 text-base leading-relaxed text-muted">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
