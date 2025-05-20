// post.js
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titel', type: 'string' },
    { name: 'category', title: 'Kategori', type: 'string' },
    { name: 'year', title: 'År', type: 'string' },
    { name: 'producer', title: 'Producent', type: 'string' },
    { name: 'genre', title: 'Genre', type: 'string' },
    { name: 'content', title: 'Recension', type: 'text' },
    { name: 'createdAt', title: 'Publicerad', type: 'datetime' }
  ]
}
