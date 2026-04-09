import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Auteur',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nom complet', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Rôle / Titre', type: 'string' }),
    defineField({ name: 'initials', title: 'Initiales (ex: AL)', type: 'string' }),
    defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'linkedin', title: 'URL LinkedIn', type: 'url' }),
  ],
})
