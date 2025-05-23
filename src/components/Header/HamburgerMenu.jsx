// Importerar React och useState för att hantera komponentens tillstånd 
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, NavLink } from "react-router-dom";
import './HamburgerMenu.css';

// Skapar en funktionell komponent för hamburgermenyn
const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const { user: loggedIn } = useAuth(); // Hämtar inloggad användare
  // Hanterar öppning och stängning av menyn med useState-hooken

  const hamburgerRef = useRef(null);
  const menuRef = useRef(null);
  
  // Hook för att lyssna på klick utanför hamburger och meny
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        hamburgerRef.current &&
        menuRef.current &&
        !hamburgerRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Funktion för att stänga menyn när en länk klickas
  const handleLinkClick = () => {
    setOpen(false);
  };


  return (
    <section className="hamburger-container">
      <section
        ref={hamburgerRef}
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </section>
      {/* Visa menyn om den är öppen */}
      {open && (
        <section ref={menuRef} className="hamburger-menu">

          <Link to="/" onClick={handleLinkClick}>Hem</Link>
          <Link to="/explore" onClick={handleLinkClick}>Utforska</Link>
          <NavLink to="/profiles" onClick={handleLinkClick}>Profiler</NavLink>
          {loggedIn && (
          <NavLink to={`/profile/${loggedIn._id}`} onClick={handleLinkClick}>Min profil</NavLink>)}
          <Link to="/create" onClick={handleLinkClick}>Skapa inlägg</Link>
          <Link to="/register" onClick={handleLinkClick}>Registrera</Link>

        </section>
      )}
    </section>
  );
};

// Exporterar komponenten för användning i andra delar av appen
export default HamburgerMenu;
