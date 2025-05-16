// Importerar nödvändiga bibliotek och komponenter 
import React from 'react';
import './Header.css';
import Navbar from './Navbar';

// Definierar Header-komponenten som representerar sidhuvudet i applikationen
// Header-komponenten innehåller en logotyp, ett navigeringsfält och en hamburgermeny
const Header = ({ toggleTheme }) => {
  return (
    <header className="header">
      <h1 className="header-logo">MedieTema</h1>
      <Navbar toggleTheme={toggleTheme} />
    </header>
  );
};

// Exporterar Header-komponenten för användning i andra delar av appen
// Header-komponenten tar emot toggleTheme-funktionen som prop för att växla mellan mörkt/ljust läge
export default Header;


