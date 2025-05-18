import React, { useEffect, useState } from "react";
import  {client}  from "../../sanityClient";
import  {writeClient}  from "../../sanityClient";

import "./Explore.css";
import { Link } from "react-router-dom";

const Explore = () => {
  const [posts, setPosts] = useState([]); // Inlägg
  const [selectedCategory, setSelectedCategory] = useState(null); // Vald kategori
  const [genres, setGenres] = useState([]); // Valda genrer
  const [selectedGenres, setSelectedGenres] = useState([]);  // Valda genrer
  const [searchTerm, setSearchTerm] = useState(''); // Sökfält
  const [showGenres, setShowGenres] = useState(false);  // Filtrering boxen



  const categories = [
    { title: "🎮 Spel", slug: "spel" },
    { title: "🎬 Film", slug: "film" },
    { title: "🎵 Musik", slug: "musik" },
    { title: "📚 Böcker", slug: "bocker" },
  ];
  // Hämtar alla inlägg
  const fetchAllPosts = async () => {
    const query = `*[_type == "post"]{
      _id,
      title,
      slug,
      year,
      producer,
      category->{title, slug},
      genres[]->{title},
      body,
      likes,
      dislikes
    }`;
    const result = await client.fetch(query);
    setPosts(result);
  };
  // Hämtar inlägg baserat på vald kategori
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
        body,
        likes,
        dislikes
      }
    `;
    const result = await client.fetch(query, { slug });
    setPosts(result);
  };
  // Hämtar genrer för en vald kategori
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
  // Hämtar genrer för en vald kategori
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
      body,
      likes,
      dislikes
    }
  `;

    const result = await client.fetch(query, {
      slug: selectedCategory,
      genreTitles: updatedGenres,
    });

    setPosts(result);
  };

 // Sökfunktion, vi kollar sökfältet och ser om vi hittar en match i titlar, producenter eller innehåll
  const handleSearch = async () => {
  if (!searchTerm.trim()) return;

  const term = searchTerm.toLowerCase(); // Lägger till tolowercase för att söka oavsett versaler

  const query = `
    *[_type == "post" && (
      title match $term ||
      producer match $term ||
      pt::text(body) match $term
    )]{
      _id,
      title,
      year,
      producer,
      category->{title, slug},
      genres[]->{title},
      body,
      likes,
      dislikes
    }
  `;
  const result = await client.fetch(query, { term: `*${term}*` });
  setPosts(result);
};

const handleLike = async (postId) => {
  await writeClient // Anväder oss avb writeClient där vi kan göra en post till sanity
    .patch(postId)
    .setIfMissing({ likes: 0 })
    .inc({ likes: 1 })
    .commit() // commitar ändringen till Sanity
    .then(() => {
      // Uppdaterar lokalt state för att reflektera ändringen
      setPosts(prev =>
        prev.map(post => post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post)
      );
    });
};
 // Hanterar ogillade inlägg och uppdeterar antalet samt visar det
const handleDislike = async (postId) => {
  await writeClient
    .patch(postId)
    .setIfMissing({ dislikes: 0 })
    .inc({ dislikes: 1 })
    .commit()
    .then(() => {
      setPosts(prev =>
        prev.map(post => post._id === postId ? { ...post, dislikes: (post.dislikes || 0) + 1 } : post)
      );
    });
    
};
// Hämtar de 10 mest gillade inläggen
// Vi måste göra en ny fetch för att hämta de mest gillade inläggen
// samma sak för minst gillade
const fetchMostLiked = async () => {
  const query = `*[_type == "post"] | order(coalesce(likes, 0) desc)[0...10] {
    _id, title,slug,
    likes,dislikes,
    year, producer,category->{title},
    genres[]->{title},
    body
  }`;
  const result = await client.fetch(query);
  setPosts(result);
};
 // Hämtar de 10 mest ogillade inläggen
const fetchLeastLiked = async () => {
  const query = `*[_type == "post"] | order(coalesce(dislikes, 0) desc)[0...10] {
    _id, title,slug,likes,dislikes,year,producer,category->{title},
    genres[]->{title},
    body
  }`;
  const result = await client.fetch(query);
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
          <input
              type="text"
              placeholder="Sök..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Sök</button>
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
  <h2 onClick={() => setShowGenres(!showGenres)}>
    Filtrera {showGenres ? "▲" : "▼"}
  </h2>
  <section className={`genre-filters ${showGenres ? "open" : ""}`}>
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
        <section className="filter-likes">
  <button onClick={fetchMostLiked}>Mest gillade</button>
  <button onClick={fetchLeastLiked}>Minst gillade</button>
</section>
   <h2>Inlägg</h2>
     {posts.length === 0 ? (
      <p>Inga inlägg ännu.</p>
       ) : (
      posts.map((post) => (
      <article key={post._id} className="post-card">
        <section className="post-info">
          {post.slug?.current ? (
            <Link to={`/post/${post.slug.current}`}>
              <h3>{post.title}</h3> </Link>
                  ) : (
                  <h3>{post.title}</h3>)}
                <p>År: {post.year}</p>
                <p>Producent: {post.producer}</p>
                <p>Kategori: {post.category?.title}</p>
                <p>Genrer: {post.genres?.map((g) => g.title).join(", ")}</p>
                <p>Innehåll: {post.body}</p>
              </section>
              <section className="post-actions">
                <button onClick={() => handleLike(post._id)}>👍 {post.likes || 0}</button>
                <button onClick={() => handleDislike(post._id)}>👎 {post.dislikes || 0}</button>
              </section>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Explore;
