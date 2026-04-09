import { defineType, defineField } from 'sanity'

export const numberedSteps = defineType({
  name: 'numberedSteps',
  title: 'Étapes numérotées',
  type: 'object',
  fields: [
    defineField({
      name: 'steps', title: 'Étapes', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Titre de l\'étape' },
          { name: 'description', type: 'text', title: 'Description' },
        ],
      }],
    }),
  ],
  preview: { select: { title: 'steps' } },
})
