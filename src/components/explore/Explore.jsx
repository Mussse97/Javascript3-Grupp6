import React, { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import { writeClient } from "../../sanityClient";

import "./Explore.css";
import { Link } from "react-router-dom";

const Explore = () => {
  const [posts, setPosts] = useState([]); // Inlägg
  const [selectedCategory, setSelectedCategory] = useState(null); // Vald kategori
  const [genres, setGenres] = useState([]); // Valda genrer
  const [selectedGenres, setSelectedGenres] = useState([]); // Valda genrer
  const [searchTerm, setSearchTerm] = useState(""); // Sökfält
  const [showGenres, setShowGenres] = useState(false); // Filtrering boxen
  const [userReactions, setUserReactions] = useState({}); // Användarens reaktioner (gilla/ogilla)
  const [filteredPosts, setFilteredPosts] = useState([]); // Filtrerade inlägg
  const [isSearching, setIsSearching] = useState(false); // Om något skrivs i sökfältet

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
    setFilteredPosts(result);
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

  // Dynamisk sökning
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredPosts(posts);
      setIsSearching(false);
    } else {
      setIsSearching(true);
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          (post.producer && post.producer.toLowerCase().includes(term)) ||
          (post.body && post.body.toLowerCase().includes(term)) ||
          (post.year && post.year.toString().includes(term)) ||
          (post.genres &&
            post.genres.some(
              (genre) => genre.title && genre.title.toLowerCase().includes(term)
            )) ||
          (post.category &&
            post.category.title &&
            post.category.title.toLowerCase().includes(term))
      );
      setFilteredPosts(filtered);
    }
  };

  const handleLike = async (postId) => {
    const previousReaction = userReactions[postId];

    // Om användaren redan gillat, gör inget
    if (previousReaction === "like") return;
    // Om användaren ogillat tidigare, ta bort en dislike
    if (previousReaction === "dislike") {
      await writeClient.patch(postId).dec({ dislikes: 1 }).commit();
    }

    await writeClient
      .patch(postId)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit();

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: (post.likes || 0) + 1,
              dislikes:
                previousReaction === "dislike"
                  ? post.dislikes - 1
                  : post.dislikes,
            }
          : post
      )
    );
    const updatedReactions = {
      ...userReactions,
      [postId]: "like",
    };
    setUserReactions(updatedReactions);
    localStorage.setItem("userReactions", JSON.stringify(updatedReactions));
  };
  // I denna funktion kollar vi om användaren redan ogillat inlägget
  // Om de inte har det så lägger den till en dislike och pushar det till sanity
  // Om de har gillat inlägget tidigare så tar den bort en like och lägger till en dislike
  // Sedan uppdaterar den state och localStorage
  // Sist så uppdaterar den gränsen
  const handleDislike = async (postId) => {
    const previousReaction = userReactions[postId];

    // Om användaren redan ogillat, gör inget
    if (previousReaction === "dislike") return;
    // Om användaren gillat tidigare, ta bort en like
    if (previousReaction === "like") {
      await writeClient.patch(postId).dec({ likes: 1 }).commit();
    }

    await writeClient
      .patch(postId)
      .setIfMissing({ dislikes: 0 })
      .inc({ dislikes: 1 })
      .commit();

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              dislikes: (post.dislikes || 0) + 1,
              likes: previousReaction === "like" ? post.likes - 1 : post.likes,
            }
          : post
      )
    );
    const updatedReactions = {
      ...userReactions,
      [postId]: "dislike",
    };

    setUserReactions(updatedReactions);
    localStorage.setItem("userReactions", JSON.stringify(updatedReactions));
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
    setShowGenres(true);
    setSelectedCategory(slug);
    setSelectedGenres([]);
    await fetchGenresByCategory(slug);
    await fetchPostsByCategory(slug);
  };

  // kollar lokalt om det finns några reaktioner
  // Om det finns så sätter den state till de reaktionerna
  // Hämtar alla inlägg
  useEffect(() => {
    fetchAllPosts();
    const savedReactions =
      JSON.parse(localStorage.getItem("userReactions")) || {};
    setUserReactions(savedReactions);
  }, []);

  return (
    <main className="explore">
      <header className="explore-header">
        <section className="search-section">
          <h1 className="explore-heading">Upptäck senaste inläggen</h1>
          <section className="search-bar">
          <input

            type="text"
            placeholder="Sök..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </section>
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

        {isSearching && filteredPosts.length === 0 && (
          <div className="no-results-message">
            <p>Det finns inget som matchar din sökning på "{searchTerm}"</p>
          </div>
        )}

        {posts.length === 0 ? (
          <p>Inga inlägg ännu.</p>
        ) : (
          filteredPosts.map((post) => (
            <article key={post._id} className="post-card">
              <section className="post-info">
                {post.slug?.current ? (
                  <Link to={`/post/${post.slug.current}`}>
                    <h3>{post.title}</h3>{" "}
                  </Link>
                ) : (
                  <h3>{post.title}</h3>
                )}
                <p>År: {post.year}</p>
                <p>Producent: {post.producer}</p>
                <p>Kategori: {post.category?.title}</p>
                <p>Genrer: {post.genres?.map((g) => g.title).join(", ")}</p>
                <p>Innehåll: {post.body}</p>
              </section>
              <section className="post-actions">
                <button
                  onClick={() => handleLike(post._id)}
                  disabled={userReactions[post._id] === "like"}
                  style={{
                    backgroundColor:
                      userReactions[post._id] === "like" ? "#d4af37" : "",
                    cursor:
                      userReactions[post._id] === "like"
                        ? "not-allowed"
                        : "pointer",
                    color: userReactions[post._id] === "like" ? "black" : "",
                  }}
                >
                  👍 {post.likes || 0}
                </button>

                <button
                  onClick={() => handleDislike(post._id)}
                  disabled={userReactions[post._id] === "dislike"}
                  style={{
                    backgroundColor:
                      userReactions[post._id] === "dislike" ? "#d4af37" : "",
                    cursor:
                      userReactions[post._id] === "dislike"
                        ? "not-allowed"
                        : "pointer",
                    color: userReactions[post._id] === "dislike" ? "black" : "",
                  }}
                >
                  👎 {post.dislikes || 0}
                </button>
              </section>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Explore;
