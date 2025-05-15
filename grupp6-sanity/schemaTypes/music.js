export default {
  name: 'music',
  title: 'Music',
  type: 'document',
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
      },
    },
    {
      name: 'cover',
      type: 'image',
      title: 'Omslagsbild',
      options: {hotspot: true}, // Gör så att man kan bestämma fokuspunkt/croppa bilder i sanity
    },
    {
      name: 'review',
      type: 'text',
      title: 'Recension',
    },
  ],
}
