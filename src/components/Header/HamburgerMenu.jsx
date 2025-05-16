// Importera React och useState för att hantera komponentens tillstånd 
import React, { useState } from 'react';
import './HamburgerMenu.css';

// Skapa en funktionell komponent för hamburgermenyn 
const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  // Hantera öppning och stängning av menyn med useState-hooken 
  return (
     <div className="hamburger-container">
      <div
        className={`hamburger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      {/* Visa menyn om den är öppen */}
      {open && (
        <div className="hamburger-menu">
          <a href="/">Hem</a>
          <a href="/about">Utforska</a>
          <a href="/contact">Profiler</a>
          <a href="/create">Skapa inlägg</a>
        </div>
      )}
    </div>
  );
};

// Exportera komponenten för användning i andra delar av appen 
export default HamburgerMenu;


