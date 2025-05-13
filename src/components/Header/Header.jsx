import React from 'react';
import './Header.css';
import Navbar from './Navbar';
import HamburgerMenu from './HamburgerMenu';

const Header = () => {
  return (
    <div className="header-wrapper">
      <header className="header">
        <h1 className="logo">MedieTema</h1>
        <Navbar />
        <HamburgerMenu />
      </header>
    </div>
  );
};

export default Header;
