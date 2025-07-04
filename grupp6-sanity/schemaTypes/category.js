// Exporterar ett schema för Sanity CMS som definierar strukturen för kategoridata som ska lagras i Sanity CMS
export default {
  name: 'category',
  type: 'document',
  title: 'Kategori',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Kategori-namn',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
  ],
};
