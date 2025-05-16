import React, { useEffect, useState } from 'react';
import client from '../sanityClient'; // ✅ Rätt import
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [genres, setGenres] = useState([]);

  const handleCategoryClick = (slug) => {
    const newSlug = selectedCategory === slug ? null : slug;
    setSelectedCategory(newSlug);

    // Här kan du lägga till egen filtrering om du vill
    // Just nu används slug bara för att markera valt filter
  };

  const categories = [
    { title: '🎮 Spel', slug: 'spel' },
    { title: '🎬 Film', slug: 'film' },
    { title: '🎵 Musik', slug: 'musik' },
    { title: '📚 Böcker', slug: 'böcker' },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      const query = `*[_type == "post"]{
        _id,
        title,
        year,
        producer,
        category,
        genre,
        content,
        createdAt
      }`;

      try {
        const result = await client.fetch(query);
        setPosts(result);
      } catch (error) {
        console.error('Fel vid hämtning av inlägg:', error);
      }
    };

    fetchPosts();
  }, []);

  // Filtrera inlägg om kategori är vald
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category.toLowerCase() === selectedCategory)
    : posts;

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
            onClick={() => handleCategoryClick(cat.slug)}
          >
            {cat.title}
          </button>
        ))}
      </section>

      <section className="posts-section">
        <h2>Inlägg</h2>
        {filteredPosts.length === 0 ? (
          <p>Inga inlägg ännu.</p>
        ) : (
          filteredPosts.map(post => (
            <article key={post._id} className="post-card">
              <div className="post-info">
                <h3>{post.title}</h3>
                <p>År: {post.year}</p>
                <p>Producent: {post.producer}</p>
                <p>Kategori: {post.category}</p>
                <p>Genre: {post.genre}</p>
                <p>Recension: {post.content}</p>
                <p><small>Publicerad: {new Date(post.createdAt).toLocaleString()}</small></p>
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
