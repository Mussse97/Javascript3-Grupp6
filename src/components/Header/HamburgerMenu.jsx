// Importerar React och useState för att hantera komponentens tillstånd 
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import './HamburgerMenu.css';

// Skapar en funktionell komponent för hamburgermenyn
const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const { user: loggedIn } = useAuth(); // Hämtar inloggad användare
  // Hanterar öppning och stängning av menyn med useState-hooken
  return (
    <section className="hamburger-container">
      <section
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </section>
      {/* Visa menyn om den är öppen */}
      {open && (
        <section className="hamburger-menu">

          <Link to="/">Hem</Link>
          <Link to="/explore">Utforska</Link>
          <NavLink to="/profiles">Profiler</NavLink>
          {loggedIn && <NavLink to={`/profile/${loggedIn._id}`}>Min profil</NavLink>}
          <Link to="/create">Skapa inlägg</Link>
          <Link to="/register">Registrera</Link>

        </section>
      )}
    </section>
  );
};

// Exporterar komponenten för användning i andra delar av appen
export default HamburgerMenu;
