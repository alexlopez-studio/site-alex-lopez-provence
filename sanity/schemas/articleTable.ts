import { defineType, defineField } from 'sanity'

export const articleTable = defineType({
  name: 'articleTable',
  title: 'Tableau',
  type: 'object',
  fields: [
    defineField({ name: 'headers', title: 'En-têtes de colonnes', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'rows', title: 'Lignes', type: 'array',
      of: [{ type: 'object', fields: [{ name: 'cells', title: 'Cellules', type: 'array', of: [{ type: 'string' }] }] }],
    }),
  ],
  preview: { select: { title: 'headers' } },
})
