import React, { useEffect, useState } from "react";
import  {client}  from "../../sanityClient";
import "./Explore.css";
import { Link } from "react-router-dom";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const categories = [
    { title: "🎮 Spel", slug: "spel" },
    { title: "🎬 Film", slug: "film" },
    { title: "🎵 Musik", slug: "musik" },
    { title: "📚 Böcker", slug: "bocker" },
  ];

  const fetchAllPosts = async () => {
    const query = `*[_type == "post"]{
      _id,
      title,
      slug,
      year,
      producer,
      category->{title, slug},
      genres[]->{title},
      body
    }`;
    const result = await client.fetch(query);
    setPosts(result);
  };

  const fetchPostsByCategory = async (slug) => {
    const query = `
      *[_type == "post" && category->slug.current == $slug]{
        _id,
        title,
        slug,
        year,
        producer,
        category->{title, slug},
        genres[]->{title},
        body
      }
    `;
    const result = await client.fetch(query, { slug });
    setPosts(result);
  };

  const fetchGenresByCategory = async (slug) => {
    const query = `
      *[_type == "genre" && category->slug.current == $slug]{
        _id,
        title
      }
    `;
    const result = await client.fetch(query, { slug });
    setGenres(result);
  };

  const handleGenreChange = async (e, genreTitle) => {
    const checked = e.target.checked;
    let updatedGenres;

    if (checked) {
      updatedGenres = [...selectedGenres, genreTitle];
    } else {
      updatedGenres = selectedGenres.filter((g) => g !== genreTitle);
    }

    setSelectedGenres(updatedGenres);

    // Om ingen genre är vald, hämta bara kategori-filter (utan genrefilter)
    if (updatedGenres.length === 0) {
      fetchPostsByCategory(selectedCategory);
      return;
    }

    // Filtrera på både kategori och genre
    const query = `
    *[_type == "post" && category->slug.current == $slug && count(genres[@->title in $genreTitles]) > 0]{
      _id,
      title,
      slug,
      year,
      producer,
      category->{title, slug},
      genres[]->{title},
      body
    }
  `;

    const result = await client.fetch(query, {
      slug: selectedCategory,
      genreTitles: updatedGenres,
    });

    setPosts(result);
  };

  const handleCategoryClick = async (slug) => {
    // Om man klickar på samma kategori igen -> nollställ
    if (selectedCategory === slug) {
      setSelectedCategory(null);
      setGenres([]);
      setSelectedGenres([]);
      fetchAllPosts();
      return;
    }
    // Nollställ genrer och kategori om man klickar på dem igen
    setSelectedCategory(slug);
    setSelectedGenres([]);
    await fetchGenresByCategory(slug);
    await fetchPostsByCategory(slug);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <main className="explore">
      <header className="explore-header">
        <section className="search-section">
          <h1>Upptäck senaste inläggen</h1>
          <input type="text" placeholder="Sök..." />
          <button>Sök</button>
        </section>
      </header>

      <section className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            className={`category-btn ${
              selectedCategory === cat.slug ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            {cat.title}
          </button>
        ))}
      </section>

      <section className="filter-section">
        <h2>Filtrera</h2>
        <section className="genre-filters">
          {genres.length === 0 ? (
            <p>Inga genrer tillgängliga</p>
          ) : (
            genres.map((genre) => (
              <label key={genre._id}>
                <input
                  type="checkbox"
                  onChange={(e) => handleGenreChange(e, genre.title)}
                  checked={selectedGenres.includes(genre.title)}
                />
                {genre.title}
              </label>
            ))
          )}
        </section>
      </section>

      <section className="posts-section">
        <h2>Inlägg</h2>
        {posts.length === 0 ? (
          <p>Inga inlägg ännu.</p>
        ) : (
          posts.map((post) => (
            <article key={post._id} className="post-card">
              <section className="post-info">
                {post.slug?.current && (
                  <Link to={`/post/${post.slug.current}`}>
                    <h3>{post.title}</h3>
                  </Link>
                )}
                <p>År: {post.year}</p>
                <p>Producent: {post.producer}</p>
                <p>Kategori: {post.category?.title}</p>
                <p>Genrer: {post.genres?.map((g) => g.title).join(", ")}</p>
                <p>Innehåll: {post.body}</p>
              </section>
              <section className="post-actions">
                <button>👍</button>
                <button>👎</button>
              </section>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Explore;
