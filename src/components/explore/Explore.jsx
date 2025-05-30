import React, { useEffect, useState } from "react";
import { client, writeClient, previewClient } from "../../sanityClient";
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

  // Hämtar alla posts från Sanity med GROQ-query
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

  // Hämtar alla Genrer för tillhörande Kategorier
  const fetchGenresByCategory = async (slug) => {
    const query = `*[_type == "genre" && category->slug.current == $slug]{ _id, title }`;
    const result = await client.fetch(query, { slug });
    setGenres(result);
  };

  // Denna kod hanterar klick-event på kategorierna
  // Om du klickar på en redan markerad kategori så avmarkeras den / det återgår till att visa poster utan filtrering
  // Annars filtreras posterna enligt den kategori som valts
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

  // Denna kod hanterar val av genre
  // När användaren kryssar i en av genre-checkboxarna så filtreras resultaten av poster efter den/de valda genre(n/s)
  // Varje i-klickad checkbox uppdaterar filtreringen
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

  // Visar hur många resultat som finns tillgängliga för varje genre
  const getGenreCount = (genreTitle) => {
    return posts.filter(
      (post) =>
        post.category?.slug?.current === selectedCategory &&
        post.genres?.some((g) => g.title === genreTitle)
    ).length;
  };

  // Denna kod hanterar det som skrivs i sökfältet
  // Man kan söka på all kontent i ett inlägg, oavsett om det gäller titel, årstal, recensionen etc.
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

  // Denna kod sorterar och visar de 10 mest gillade inläggen (högst antal likes först).
  // Kan återgå till ursprunglig sortering genom att trycka på samma knapp igen
  const fetchMostLiked = () => {
    if (activeSort === "most") {
      setFilteredPosts(posts);
      setActiveSort(null);
      return;
    }
    const sorted = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    setFilteredPosts(sorted.slice(0, 10));
    setActiveSort("most");
  };

  // Denna kod sorterar och visar de 10 *minst* gillade inläggen (högst antal dislikes först).
  const fetchLeastLiked = () => {
    if (activeSort === "least") {
      setFilteredPosts(posts);
      setActiveSort(null);
      return;
    }
    const sorted = [...posts].sort(
      (a, b) => (b.dislikes || 0) - (a.dislikes || 0)
    );
    setFilteredPosts(sorted.slice(0, 10));
    setActiveSort("least");
  };


 // funktion som hanterar reaktioner (gilla/ogilla) på inlägg
const handleReaction = async (postId, type) => {
  // type kan vara "like" eller "dislike"
  const opposite = type === "like" ? "dislike" : "like";
  const previousReaction = userReactions[postId];

  // Om användaren redan har klickat på samma typ (t.ex. redan gillat), gör inget
  if (previousReaction === type) return;

  // Om användaren hade den motsatta reaktionen tidigare, ta bort den
  if (previousReaction === opposite) {
    await writeClient.patch(postId).dec({ [opposite + 's']: 1 }).commit();
  }

  // Lägg till den nya reaktionen
  // Användning av strängkonkatenering för att dynamiskt sätta likes/dislikes
  // type blir like eller dislike + s för "likes" eller "dislikes" som då matchar schemafältet
  // Med strängkonkatenering slipper vi dubbel kod för likes och dislikes
  await writeClient
    .patch(postId)
    .setIfMissing({ [type + 's']: 0 }) 
    .inc({ [type + 's']: 1 })
    .commit();

  // Optimistisk uppdatering i UI (för både posts och filteredPosts)
  const updateState = (listSetter) => {
    listSetter(prev =>
      prev.map(post =>
        post._id === postId
          ? {
              ...post,
              [type + 's']: (post[type + 's'] || 0) + 1, // t.ex. likes++
              [opposite + 's']: previousReaction === opposite
                ? Math.max((post[opposite + 's'] || 0) - 1, 0)
                : post[opposite + 's']
            }
          : post
      )
    );
  };

  updateState(setPosts);
  updateState(setFilteredPosts);

  // Uppdatera localStorage och state
  const updated = { ...userReactions, [postId]: type };
  setUserReactions(updated);
  localStorage.setItem("userReactions", JSON.stringify(updated));
};


  // Denna kod hämtar alla inlägg vid första rendering och laddar användarens tidigare reaktioner från localStorage
  useEffect(() => {
    fetchAllPosts();
    const saved = JSON.parse(localStorage.getItem("userReactions")) || {}; // Laddar sparade gillningar/ogillningar
    setUserReactions(saved);
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
              onKeyDown={(e) => {
                // I sökfältet när du trycker Enter så får du samma resultat som när du trycker på sök-knappen, du blir skickad ner till "Inlägg" som har id:t #posts
                if (e.key === "Enter") {
                  e.preventDefault();
                  document
                    .querySelector("#posts")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
            <a href="#posts">
              <button className="cta-button">🔍</button>
            </a>
          </section>
        </section>
      </header>

      <section className="category-buttons">
        {categories.map((cat) => (
          // Populerar sektionen med knapparna för kategorier
          <button
            key={cat.slug}
            className={`category-btn ${
              // Gör en kategori "active" när den blir klickad
              selectedCategory === cat.slug ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            {cat.title}
          </button>
        ))}
      </section>

      {/* Filtreringssektion för genrer med expanderbar meny */}
      <section className="filter-section">
        <h2 onClick={() => setShowGenres(!showGenres)}>
          Filtrera {showGenres ? "▲" : "▼"}
        </h2>
        {/* Genre-filtreringsalternativ (visas/döljs) */}
        <section className={`genre-filters ${showGenres ? "open" : ""}`}>
          {genres.length === 0 ? (
            <p>Inga genrer tillgängliga</p>
          ) : (
            genres.map((genre) => (
              // Lista med alla genrer som checkboxar
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
              backgroundColor: activeSort === "most" ? "#d4af37" : "",
              color: activeSort === "most" ? "black" : "",
            }}
          >
            Mest gillade
          </button>

          <button
            onClick={fetchLeastLiked}
            style={{
              backgroundColor: activeSort === "least" ? "#d4af37" : "",
              color: activeSort === "least" ? "black" : "",
            }}
          >
            Minst gillade
          </button>
        </section>

        <h2 id="posts">Inlägg</h2>

        {/* Om något skrivs i sökfältet och det inte finns något matchande resultat så dyker paragrafen upp som säger att det inte finns något som matchar sökningen */}
        {isSearching && filteredPosts.length === 0 && (
          <div className="no-results-message">
            <p>Det finns inget som matchar din sökning på "{searchTerm}"</p>
          </div>
        )}

        {/* Renderar filtrerade inlägg eller "Inga inlägg"-meddelande */}
        {filteredPosts.length === 0 ? (
          <p className="noPostsYet">Inga inlägg ännu.</p>
        ) : (
          // Loopar genom alla filtrerade inlägg och renderar som kort
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
                      onClick={() => handleReaction(post._id, "like")}
                      disabled={userReactions[post._id] === "like"}
                      style={{
                        backgroundColor: userReactions[post._id] === "like" ? "#d4af37" : "",
                        cursor: userReactions[post._id] === "like" ? "not-allowed" : "pointer",
                        color: userReactions[post._id] === "like" ? "black" : "",
                      }}>
                      👍 {post.likes || 0}
                  </button>

                    <button
                      onClick={() => handleReaction(post._id, "dislike")}
                      disabled={userReactions[post._id] === "dislike"}
                      style={{
                        backgroundColor: userReactions[post._id] === "dislike" ? "#d4af37" : "",
                        cursor: userReactions[post._id] === "dislike" ? "not-allowed" : "pointer",
                        color: userReactions[post._id] === "dislike" ? "black" : "",
                      }}>
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
