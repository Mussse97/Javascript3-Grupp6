
// Importerar nödvändiga bibliotek och komponenter 
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from './components/Header';
import SinglePost from "./components/singlepost/SinglePost";
import Footer from './components/footer/Footer';
import Explore from './components/explore/Explore';
import CreatePost from './components/CreatePost'; 
import './App.css';


function App() {
      const [isDarkMode, setIsDarkMode] = useState(true);
      const toggleTheme = () => setIsDarkMode(prev => !prev);
      // useState-hooken hanterar tillståndet för mörkt/ljust läge, toggleTheme-funktionen växlar mellan lägena
      useEffect(() => {
        document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
      }, [isDarkMode]);
      // useEffect-hooken används, uppdaterar klassnamnet på body-elementet på det aktuella läget (mörkt eller ljust)
  
  return (
    <>
      <Header toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/post/:slug" element={<SinglePost />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
