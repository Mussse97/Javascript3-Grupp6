import React, { useEffect, useState } from 'react';
import Footer from './components/footer/Footer';
import { Header } from './components/Header';
import './App.css';
import Explore from './components/Explore';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  return (
    <>
      <Header toggleTheme={toggleTheme} />
      <Explore />
      <Footer />
    </>
  );
}

export default App;
