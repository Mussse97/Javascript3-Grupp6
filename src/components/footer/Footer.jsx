// Importerar CSS-filen för Footer-komponenten 
import './Footer.css';

// Footer-komponenten som används för att visa sidfoten på webbplatsen, (innehåller länkar till sociala medier)
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Följ oss på sociala medier:</p>
        <div className="social-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

// Exporterar Footer-komponenten så att den kan användas i andra delar av applikationen 
export default Footer;
