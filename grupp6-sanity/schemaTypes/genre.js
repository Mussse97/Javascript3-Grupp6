// Exporterar ett schema för Sanity CMS
export default {
  name: 'genre',
  type: 'document',
  title: 'Genre',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Genre-namn',
    },
    {
      
      name: 'category',
      type: 'reference',
      title: 'Kategori',
      to: [{ type: 'category' }],
    },
  ],
};
