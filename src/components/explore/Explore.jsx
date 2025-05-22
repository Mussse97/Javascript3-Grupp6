
import React, { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import { writeClient } from "../../sanityClient";
import "./Explore.css";
import { Link } from "react-router-dom";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenres, setShowGenres] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [isSearching, setIsSearching] = useState(false); // Om något skrivs i sökfältet
  const [activeSort, setActiveSort] = useState(null); // 'most' | 'least' | null


  const categories = [
    { title: "🎮 Spel", slug: "spel" },
    { title: "🎬 Film", slug: "film" },
    { title: "🎵 Musik", slug: "musik" },
    { title: "📚 Böcker", slug: "bocker" },
  ];

  const fetchAllPosts = async () => {
    const query = `*[_type == "post"]{
      _id, title, slug, year, producer,
      category->{title, slug},
      genres[]->{title},
      body, likes, dislikes
    }`;
    const result = await client.fetch(query);
    setPosts(result);
    setFilteredPosts(result);
  };

  const fetchGenresByCategory = async (slug) => {
    const query = `*[_type == "genre" && category->slug.current == $slug]{ _id, title }`;
    const result = await client.fetch(query, { slug });
    setGenres(result);
  };

  const handleCategoryClick = async (slug) => {
    if (selectedCategory === slug) {
      setSelectedCategory(null);
      setGenres([]);
      setSelectedGenres([]);
      setFilteredPosts(posts);
      return;
    }
    setSelectedCategory(slug);
    setShowGenres(true);
    setSelectedGenres([]);
    const filtered = posts.filter(
      (post) => post.category?.slug?.current === slug
    );
    setFilteredPosts(filtered);
    await fetchGenresByCategory(slug);
  };

  const handleGenreChange = (e, genreTitle) => {
    const checked = e.target.checked;
    let updatedGenres = checked
      ? [...selectedGenres, genreTitle]
      : selectedGenres.filter((g) => g !== genreTitle);

    setSelectedGenres(updatedGenres);

    if (selectedCategory && updatedGenres.length > 0) {
      const filtered = posts.filter(
        (post) =>
          post.category?.slug?.current === selectedCategory &&
          post.genres?.some((g) => updatedGenres.includes(g.title))
      );
      setFilteredPosts(filtered);
    } else if (selectedCategory) {
      const filtered = posts.filter(
        (post) => post.category?.slug?.current === selectedCategory
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  const getGenreCount = (genreTitle) => {
  return posts.filter(
    (post) =>
      post.category?.slug?.current === selectedCategory &&
      post.genres?.some((g) => g.title === genreTitle)
  ).length;
};


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

const fetchMostLiked = () => {
  if (activeSort === 'most') {
    setFilteredPosts(posts);
    setActiveSort(null);
    return;
  }
  const sorted = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  setFilteredPosts(sorted.slice(0, 10));
  setActiveSort('most');
};

const fetchLeastLiked = () => {
  if (activeSort === 'least') {
    setFilteredPosts(posts);
    setActiveSort(null);
    return;
  }
  const sorted = [...posts].sort((a, b) => (b.dislikes || 0) - (a.dislikes || 0));
  setFilteredPosts(sorted.slice(0, 10));
  setActiveSort('least');
};

  const handleLike = async (postId) => {
    const prev = userReactions[postId];
    if (prev === "like") return;
    if (prev === "dislike") {
      await writeClient.patch(postId).dec({ dislikes: 1 }).commit();
    }
    await writeClient.patch(postId).setIfMissing({ likes: 0 }).inc({ likes: 1 }).commit();
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: (post.likes || 0) + 1,
              dislikes: prev === "dislike" ? post.dislikes - 1 : post.dislikes,
            }
          : post
      )
    );
    const updated = { ...userReactions, [postId]: "like" };
    setUserReactions(updated);
    localStorage.setItem("userReactions", JSON.stringify(updated));
  };

  const handleDislike = async (postId) => {
    const prev = userReactions[postId];
    if (prev === "dislike") return;
    if (prev === "like") {
      await writeClient.patch(postId).dec({ likes: 1 }).commit();
    }
    await writeClient.patch(postId).setIfMissing({ dislikes: 0 }).inc({ dislikes: 1 }).commit();
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              dislikes: (post.dislikes || 0) + 1,
              likes: prev === "like" ? post.likes - 1 : post.likes,
            }
          : post
      )
    );
    const updated = { ...userReactions, [postId]: "dislike" };
    setUserReactions(updated);
    localStorage.setItem("userReactions", JSON.stringify(updated));
  };

  useEffect(() => {
    fetchAllPosts();
    const saved = JSON.parse(localStorage.getItem("userReactions")) || {};
    setUserReactions(saved);
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
            onChange={handleSearchChange}
          />

        </section>
      </header>

      <section className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            className={`category-btn ${selectedCategory === cat.slug ? "active" : ""}`}
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
                  {genre.title} ({getGenreCount(genre.title)})
                </label>
              ))
            )}

        </section>
      </section>

      <section className="posts-section">
       <section className="filter-likes">
          <button
            onClick={fetchMostLiked}
            style={{
              backgroundColor: activeSort === 'most' ? '#d4af37' : '',
              color: activeSort === 'most' ? 'black' : '',}}>
               Mest gillade
          </button>

          <button
            onClick={fetchLeastLiked}
            style={{
              backgroundColor: activeSort === 'least' ? '#d4af37' : '',
              color: activeSort === 'least' ? 'black' : '', }}>
              Minst gillade
          </button>
        </section>


        <h2>Inlägg</h2>

          {isSearching && filteredPosts.length === 0 && (
          <div className="no-results-message">
            <p>Det finns inget som matchar din sökning på "{searchTerm}"</p>
          </div>
        )}
        
        {filteredPosts.length === 0 ? (
          <p>Inga inlägg ännu.</p>
        ) : (
          filteredPosts.map((post) => (
            <article key={post._id} className="post-card">
              <section className="post-info">
                {post.slug?.current ? (
                  <Link to={`/post/${post.slug.current}`}>
                    <h3>{post.title}</h3>
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
                    backgroundColor: userReactions[post._id] === "like" ? "#d4af37" : "",
                    cursor: userReactions[post._id] === "like" ? "not-allowed" : "pointer",
                    color: userReactions[post._id] === "like" ? "black" : "",
                  }}
                >
                  👍 {post.likes || 0}
                </button>

                <button
                  onClick={() => handleDislike(post._id)}
                  disabled={userReactions[post._id] === "dislike"}
                  style={{
                    backgroundColor: userReactions[post._id] === "dislike" ? "#d4af37" : "",
                    cursor: userReactions[post._id] === "dislike" ? "not-allowed" : "pointer",
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
