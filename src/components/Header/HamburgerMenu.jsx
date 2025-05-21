
// Importera React och useState för att hantera komponentens tillstånd 
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import './HamburgerMenu.css';


// Skapa en funktionell komponent för hamburgermenyn
const HamburgerMenu = ({ mockUser }) => {
  const [open, setOpen] = useState(false);
  const { user: loggedIn } = mockUser ? { user: mockUser } : useAuth();
  /*const { user: loggedIn } = useAuth(); Hämtar inloggad användare */
  // Hantera öppning och stängning av menyn med useState-hooken
  return (
    <div className="hamburger-container">
      <div
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      {/* Visa menyn om den är öppen */}
      {open && (
        <div className="hamburger-menu">

          <Link to="/">Hem</Link>
          <Link to="/explore">Utforska</Link>
          <NavLink to="/profiles">Profiler</NavLink>
          {loggedIn && <NavLink to={`/profile/${loggedIn._id}`}>Min profil</NavLink>}
          <Link to="/create">Skapa inlägg</Link>
          <Link to="/register">Registrera</Link>

        </div>
      )}
    </div>
  );
};

// Exportera komponenten för användning i andra delar av appen
export default HamburgerMenu;
