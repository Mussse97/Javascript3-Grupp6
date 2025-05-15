// Importerar React och Navbar-komponenten  
import React from 'react';
import './Header.css';
import Navbar from './Navbar';

// Definierar Header-komponenten som representerar sidhuvudet i applikationen
// Header-komponenten innehåller en logotyp, ett navigeringsfält och en hamburgermeny
const Header = () => {
  return (
    <div>
      <header className="header">
        <h1 className="header-logo">MedieTema</h1>
        <Navbar />
      </header>
    </div>
  );
};

// Exporterar Header-komponenten för användning i andra delar av applikationen 
export default Header;
