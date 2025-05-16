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

      to: [{ type: 'category' }],
    },
    {
      name: 'genres',
      type: 'array',
      title: 'Genrer',

      of: [{ type: 'reference', to: [{ type: 'genre' }] }],
    },
    {
      name: 'body',
      type: 'text',
      title: 'Innehåll',
    },
  ],
};
