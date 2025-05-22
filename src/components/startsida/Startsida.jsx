import React, { useState, useEffect } from "react";
import "./startsida.css";
import { client } from "../../sanityClient";
import { Link } from "react-router-dom";

const Startsida = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);

  const latestQuery = `*[_type == "post" && defined(slug.current)] | order(_createdAt desc)[0...4] {
    _id,
    title,
    slug,
    "category": category->title,
    "imageUrl": mainImage.asset->url,
    body,
    _createdAt
  }`;

  const popularQuery = `*[_type == "post" && defined(slug.current)] | order(coalesce(likes, 0) desc)[0...3] {
  _id,
  title,
  slug,
  "category": category->title,
  "imageUrl": mainImage.asset->url,
  body,
  likes
}`;

  // Vi hämtar texten från body-fältet och begränsar den till ett visst antal ord eftersom korten inte är så stora
  const getPlainTextExcerpt = (body, wordLimit = 30) => {
    if (!Array.isArray(body)) return "";
    const textBlocks = body
      .filter((block) => block._type === "block")
      .map((block) => block.children.map((child) => child.text).join(""))
      .join(" ");
    return textBlocks.split(" ").slice(0, wordLimit).join(" ") + "...";
  };

  useEffect(() => {
    const fetchData = async () => {
      const latest = await client.fetch(latestQuery);
      const popular = await client.fetch(popularQuery);
      setLatestPosts(latest);
      setPopularArticles(popular);
    };

    fetchData();
  });

  return (
    <section className="startsida-wrapper">
      <header></header>
      <main className="startsida-main">
        <section className="hero-section">
          <h2>Välkommen till MedieTema!</h2>
          <p className="hero-text">
            Din plats för diskussioner om film, musik, spel och böcker! Skapa
            inlägg, dela dina tankar och upptäck nya favoriter
          </p>
          <Link to={`/explore`}>
            <button className="cta-button">Utforska Mer!</button>
          </Link>
          {/* <NavLink className="cta-button" to="/profiles">Profiler</NavLink> */}
        </section>

        <section className="news-section">
          <h2>Senaste inlägg</h2>
          <section className="news-grid">
            {latestPosts.map((item) => (
              <article key={item._id} className="news-card">
                <span className="news-category">{item.category}</span>

                <Link to={`/post/${item.slug?.current}`}>
                  <h3>{item.title}</h3>
                </Link>

                <p>{getPlainTextExcerpt(item.body)}</p>
                <small>
                  {new Date(item._createdAt).toLocaleDateString("sv-SE")}
                </small>

                <Link to={`/post/${item.slug?.current}`} className="read-more">
                  Läs mer
                </Link>
              </article>
            ))}
          </section>
        </section>

        <section className="popular-section">
          <h2>Populärt & Trendigt</h2>
          <section className="popular-grid">
            {popularArticles.map((article) => (
              <section key={article._id} className="popular-card">
                <section className="card-image-container">
                  <span className="popular-category">{article.category}</span>
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="card-image"
                    />
                  )}
                </section>
                <section className="popular-card-content">
                  <Link to={`/post/${article.slug?.current}`}>
                    <h3>{article.title}</h3>
                  </Link>
                  <p>{getPlainTextExcerpt(article.body)}</p>

                  <Link
                    to={`/post/${article.slug?.current}`}
                    className="read-more"
                  >
                    Läs mer
                  </Link>
                </section>
              </section>
            ))}
          </section>
        </section>
      </main>
      <footer> {/*FOOOOOOOOOOOTER HÄR*/} </footer>
    </section>
  );
};

export default Startsida;
