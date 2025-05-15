import React, { useEffect, useState } from 'react';
import { client } from "../../src/sanityClient"
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [genres, setGenres] = useState([]);

 const handleCategoryClick = async (slug) => {
  const newSlug = selectedCategory === slug ? null : slug;
  setSelectedCategory(newSlug);

  if (!newSlug) {
    setGenres([]); // Rensa om ingen kategori är vald
    return;
  }

  const query = `
    *[_type == "genre" && category->slug.current == $slug]{
      _id,
      title
    }
  `;

  const result = await client.fetch(query, { slug: newSlug });
  setGenres(result);
};


const categories = [
  { title: '🎮 Spel', slug: 'spel' },
  { title: '🎬 Film', slug: 'film' },
  { title: '🎵 Musik', slug: 'musik' },
  { title: '📚 Böcker', slug: 'bocker' }, 
];

  useEffect(() => {
    const fetchPosts = async () => {
      const query = `*[_type == "post"]{
        _id,
        title,
        year,
        producer,
        category->{title},
        genres[]->{title},
        body
      }`;
      const result = await client.fetch(query);
      setPosts(result);
    };

    fetchPosts();
   

  }, []);

  return (
    <main className="explore">
      <header className="explore-header">
        <h1>Media Hub</h1>
        <div className="search-section">
          <p>Upptäck nya titlar</p>
          <input type="text" placeholder="Sök..." />
          <button>Sök</button>
        </div>
      </header>

     <section className="category-buttons">
  {categories.map((cat) => (
    <button
      key={cat.slug}
      className={`category-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
      onClick={() => handleCategoryClick(cat.slug)}>
      {cat.title}
    </button>
  ))}
</section>


<section className="filter-section">
  <h2>Filtrera</h2>
  <div className="genre-filters">
    {genres.length === 0 ? (
      <p>Inga genrer tillgängliga</p>
    ) : (
      genres.map((genre) => (
        <label key={genre._id}>
          <input type="checkbox" />
          {genre.title}
        </label>
      ))
    )}
  </div>
</section>

      <section className="posts-section">
        <h2>Inlägg</h2>

        {posts.length === 0 ? (
          <p>Inga inlägg ännu.</p>
        ) : (
          posts.map(post => (
            <article key={post._id} className="post-card">
              <div className="post-info">
                <h3>{post.title}</h3>
                <p>År: {post.year}</p>
                <p>Producent: {post.producer}</p>
                <p>Kategori: {post.category?.title}</p>
                <p>Genrer: {post.genres?.map(g => g.title).join(', ')}</p>
                <p>Inehåll: {post.body}</p>
              </div>
              <div className="post-actions">
                <button>👍</button>
                <button>👎</button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Explore;
