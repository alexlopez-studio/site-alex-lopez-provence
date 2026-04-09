import { defineType, defineField } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug', title: 'Slug URL', type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category', title: 'Catégorie', type: 'string',
      options: {
        list: [
          { title: 'Conseils vendeurs', value: 'conseils-vendeurs' },
          { title: 'Conseils acheteurs', value: 'conseils-acheteurs' },
          { title: 'Marché local', value: 'marche-local' },
          { title: 'Droits & démarches', value: 'droits-demarches' },
          { title: 'Témoignages', value: 'temoignages' },
          { title: 'Vie en Provence Verte & Haut-Var', value: 'vie-provence-verte' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status', title: 'Statut', type: 'string',
      options: {
        list: [
          { title: 'Brouillon', value: 'brouillon' },
          { title: 'Relecture', value: 'relecture' },
          { title: 'Publié', value: 'publie' },
        ],
      },
      initialValue: 'brouillon',
    }),
    defineField({ name: 'author', title: 'Auteur', type: 'reference', to: [{ type: 'author' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'publishedAt', title: 'Date de publication', type: 'datetime' }),
    defineField({
      name: 'excerpt', title: 'Extrait', type: 'text', rows: 3,
      description: 'Résumé 150-160 caractères (affiché sous le H1 + meta description)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'seoDescription', title: 'Description SEO', type: 'text', rows: 2,
      description: 'Meta description personnalisée (si différente de l\'extrait) — 150-160 car.',
    }),
    defineField({
      name: 'coverImage', title: 'Image de couverture', type: 'image',
      options: { hotspot: true },
      description: 'Image OG (1200×630)',
    }),
    defineField({ name: 'readingTime', title: 'Temps de lecture (minutes)', type: 'number' }),
    defineField({
      name: 'keyword', title: 'Mot-clé principal', type: 'string',
      description: 'Doit apparaître dans le titre, le H1 et l\'extrait',
    }),
    defineField({
      name: 'body', title: 'Contenu', type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Citation', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Gras', value: 'strong' },
              { title: 'Italique', value: 'em' },
              { title: 'Souligné', value: 'underline' },
            ],
            annotations: [
              { name: 'link', type: 'object', title: 'Lien', fields: [{ name: 'href', type: 'url', title: 'URL' }] },
            ],
          },
          lists: [
            { title: 'Liste à puces', value: 'bullet' },
            { title: 'Liste numérotée', value: 'number' },
          ],
        },
        { type: 'image', options: { hotspot: true } },
        { type: 'infoBox' },
        { type: 'articleTable' },
        { type: 'numberedSteps' },
        { type: 'faq' },
      ],
    }),
    defineField({
      name: 'relatedArticles', title: 'Articles liés', type: 'array',
      description: '2-3 articles du même cluster — maillage interne SEO',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'faqs', title: 'FAQ (JSON-LD FAQPage)', type: 'array',
      description: '3-5 questions — génèrent le schema.org FAQPage pour le SEO',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Réponse' },
        ],
      }],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'category', media: 'coverImage' } },
})
