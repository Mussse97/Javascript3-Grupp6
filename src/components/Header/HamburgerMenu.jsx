import React, { useState } from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="hamburger-container">
      <button className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </button>
      {open && (
        <div className="hamburger-menu">
          <a href="/">Hem</a>
          <a href="/about">Utforska</a>
          <a href="/contact">Profiler</a>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
