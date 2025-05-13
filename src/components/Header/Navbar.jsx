import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/">Hem</a>
      <a href="/about">Utforska</a>
      <a href="/contact">Profiler</a>
    </nav>
  );
};

export default Navbar;
