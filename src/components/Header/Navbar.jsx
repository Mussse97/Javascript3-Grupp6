// Importerar React, Hamburger-komponenten och CSS-filen för Navbar-komponenten
import React from "react";
import "./Navbar.css";
import HamburgerMenu from "./HamburgerMenu"; // importera hamburger-menyn
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Definierar Navbar-komponenten som representerar navigeringsfältet i applikationen
const Navbar = ({ toggleTheme, mockUser }) => {
    const { user: loggedIn } = mockUser ? { user: mockUser } : useAuth();

  /*const { user: loggedIn } = useAuth(); Hämtar inloggad användare */
  return (
    <header className="header-wrapper">
      <nav className="navbar">
        {/* SVG-ikon för toggle mellan mörkt/ljust läge (inline) */}
        <div className="theme-icon-wrapper" onClick={toggleTheme}>
          <svg
            className="theme-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20.5 L12,3.5 C16.6944204,3.5 20.5,7.30557963 20.5,12 C20.5,16.6944204 16.6944204,20.5 12,20.5 Z" />
          </svg>
        </div>

        {/* Länkar - visas bara i desktop-läge */}
        <div className="links-wrapper">
          <Link to={"/"}>Hem</Link>
          <Link to="/explore">Utforska</Link>
          <NavLink to="/profiles">Profiler</NavLink>
          {loggedIn && <NavLink to={`/profile/${loggedIn._id}`}>Min profil</NavLink>}
          <Link to="/create">Skapa inlägg</Link>
          <Link to="/register">Registrera</Link>
        

        </div>

        {/* Hamburger-meny - visas bara i mobil-läge */}
        <HamburgerMenu />
      </nav>
    </header>
  );
};

// Exporterar Navbar-komponenten för användning i andra delar av applikationen
export default Navbar;
