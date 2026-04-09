import { defineType, defineField } from 'sanity'

export const infoBox = defineType({
  name: 'infoBox',
  title: 'Encadré info',
  type: 'object',
  fields: [
    defineField({
      name: 'variant', title: 'Type', type: 'string',
      options: { list: [{ title: 'Astuce 💡', value: 'tip' }, { title: 'Attention ⚠️', value: 'warning' }] },
      initialValue: 'tip',
    }),
    defineField({ name: 'title', title: 'Titre (optionnel)', type: 'string' }),
    defineField({ name: 'text', title: 'Contenu', type: 'text' }),
  ],
  preview: { select: { title: 'title', subtitle: 'variant' } },
})
