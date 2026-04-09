import { defineType, defineField } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ bloc',
  type: 'object',
  fields: [
    defineField({
      name: 'items', title: 'Questions / Réponses', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Réponse' },
        ],
      }],
    }),
  ],
  preview: { select: { title: 'items' } },
})
