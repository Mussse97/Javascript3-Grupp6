import React, { useState } from 'react';
import './startsida.css';
import heroBackgroundImage from '../../assets/test.jpeg';

const Startsida = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // test data, ersätt med Sanity data när / om vi ska xd
  const newsItems = [
    {
      id: 1,
      title: "Ny uppdatering till Tetris",
      category: "Spel",
      excerpt: "Ändrade formerna från kuber till circklar :O",
      date: "13 maj 4025"
    },
    {
      id: 2,
      title: "Påven släpper ny musik",
      category: "Musik",
      excerpt: "påven har börjat släppa UK drill musik",
      date: "10 maj 3025"
    },
    {
      id: 3,
      title: "Ny bok",
      category: "Böcker",
      excerpt: "Någon random lokal författare släpper ny bok",
      date: "8 maj 1025"
    },
    {
      id: 4,
      title: "Ny Film",
      category: "Film",
      excerpt: "Toy Story 19 är äntligen i produktion!",
      date: "15 maj 2036"
    },
  ];

  const popularArticles = [
    {
      id: 1,
      title: "Loser företag torskar stort",
      excerpt: "Ubisoft förlorar 400 000 000$ i deras nya spel L",
      imageUrl: "test",
      category: "Spel" // lade till kategori 
    },
    {
      id: 2,
      title: "Påven får drama",
      excerpt: "Påvens ny släppta låtar får världen att stå still",
      imageUrl: "test",
      category: "Musik" // lade till kategori 
    },
    {
      id: 3,
      title: "Lokal författare gör blunder!",
      excerpt: "Lokal författare blev skyldig 35kr under deras boksläpp",
      imageUrl: "test",
      category: "Böcker" // lade till kategori 
    }
  ];

  
  return (
    <div className="startsida-wrapper">
      <header className="site-header">  
        <div className="header-content"> 
          <div className="site-title">MedieTema</div>
          
          <button className="mobile-menu-button" onClick={toggleMenu}>
            ☰
          </button>
          
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
            <li><a href="/">test</a></li>
            <li><a href="/explore">Explore utforska bla</a></li>
            <li><a href="/test">tset</a></li>
            <li><a href="/tset">test</a></li>
            <li><a href="/test">tset</a></li>
          </ul>
        </div>
      </header>

      <main className="startsida-main">
        <section
        className="hero-section"
        style={{
          backgroundImage: `url(${heroBackgroundImage})`,
        }}
      >
        <h2>Välkommen till MedieTema!</h2>
        <p className="hero-text">Bättre sida hittar du inte! "visste inte vad jag skulle skriva..."</p>
        <button className="cta-button">Utforska Mer!</button>
      </section>

        <section className="news-section">
          <h2>Senaste nyheterna</h2>
          <div className="news-grid">
            {newsItems.map(item => (
              <article key={item.id} className="news-card">
                <span className="news-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <small>{item.date}</small>
                <a href={`/nyhet/${item.id}`} className="read-more">Läs mer</a>
              </article>
            ))}
          </div>
        </section>

        <section className="popular-section">
          <h2>Populärt & Trendigt</h2>
          <div className="popular-grid">
            {popularArticles.map(article => (
              <div key={article.id} className="popular-card">
                <div className="card-image-container">
                  <span className="popular-category">{article.category}</span>
                  <img src={article.imageUrl} alt={article.title} className="card-image" />
                </div>
                <div className="popular-card-content">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <a href={`/artikel/${article.id}`} className="read-more">Läs mer</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Om MedieTema</h3>
            <p>Vi erbjuder de bästa media för dig!</p>
            <p>Grundat 1412 med fokus på jag vet inte</p>
          </div>
          
          <div className="footer-section">
            <h3>Kontakta oss inte, Tack!</h3>
            <p>Email: info@MedieTema.se</p>
            <p>Telefon: 08-123 45 67</p>
            <p>Adress: Mediegatan 1, 111 22 Stockholm</p>
          </div>
          
          <div className="footer-section"> 
            <h3>Följ oss inte, Tack!</h3>
            <div className="social-links">
              <a href="https://linkedin.com">LinkedIn</a>
              <a href="https://twitter.com">Twitter</a>
              <a href="https://facebook.com">Facebook</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 MedieTema AB. Alla rättigheter förbehållna.</p>
        </div>
      </footer>
    </div>
  );
};

export default Startsida;