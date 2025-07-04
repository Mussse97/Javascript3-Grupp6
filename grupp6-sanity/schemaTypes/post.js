
// Exporterar ett schema för Sanity CMS som definierar strukturen för inläggsdata som ska lagras i Sanity CMS
// och innehåller fält för titel, slug, år, producent, kategori, genrer, innehåll, likes, dislikes och kommentarer
export default {
  name: 'post',
  type: 'document',
  title: 'Inlägg',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Titel',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
        auto: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'year',
      type: 'number',
      title: 'År',
    },
    {
      name: 'producer',
      type: 'string',
      title: 'Producent',
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Kategori',

      to: [{type: 'category'}],
    },
    {
      name: 'genres',
      type: 'array',
      title: 'Genrer',

      of: [{type: 'reference', to: [{type: 'genre'}]}],

    },
    {
      name: 'body',
      type: 'text',
      title: 'Recension/Innehåll',
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Publicerad',

      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'likes',
      type: 'number',
      title: 'Likes',
      initialValue: 0,
    },
    {
      name: 'dislikes',
      type: 'number',
      title: 'Dislikes',
      initialValue: 0,
    },
    {
      name: 'comments',
      type: 'array',
      title: 'Kommentarer',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Namn',
            },
            {
              name: 'comment',
              type: 'text',
              title: 'Kommentar',
            },
            {
              name: 'createdAt',
              type: 'datetime',
              title: 'Skapad',

              initialValue: () => new Date().toISOString(),
            },
          ],
        },
      ],
    },
  ],
}
