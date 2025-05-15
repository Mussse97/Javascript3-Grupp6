import React from 'react';
import './Header.css';
import Navbar from './Navbar';

const Header = ({ toggleTheme }) => {
  return (
    <header className="header">
      <h1 className="header-logo">MedieTema</h1>
      <Navbar toggleTheme={toggleTheme} />
    </header>
  );
};

export default Header;


/*Importerar React och Navbar-komponenten  
import React from 'react';
import './Header.css';
import Navbar from './Navbar';

// Definierar Header-komponenten som representerar sidhuvudet i applikationen
// Header-komponenten innehåller en logotyp, ett navigeringsfält och en hamburgermeny

export const Header = ({ toggleTheme }) => {
  return (
    <header className="header">
      <h1 className="header-logo">MedieTema</h1>
      <Navbar toggleTheme={toggleTheme} />
    </header>
  );
};*/
