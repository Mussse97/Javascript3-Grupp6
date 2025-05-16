

// Importerar nödvändiga bibliotek och komponenter 
import React, { useEffect, useState } from 'react';
import Footer from './components/footer/Footer';
import { Header } from './components/Header';
import './App.css';
import Explore from './components/Explore';
import SinglePost from "./components/singlepost/SinglePost";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Definierar huvudkomponenten för appen som hanterar mörkt/ljust läge och renderar andra komponenter
function App() {

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/post/:slug" element={<SinglePost />} />
      </Routes>

      <Footer />
    </>
  );
}

  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  // useState-hooken hanterar tillståndet för mörkt/ljust läge, toggleTheme-funktionen växlar mellan lägena
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);
  // useEffect-hooken används, uppdaterar klassnamnet på body-elementet på det aktuella läget (mörkt eller ljust)
  
  // Renderar komponenter, Header-komponenten tar emot toggleTheme-funktionen som prop
  return (
    <>

      <Header toggleTheme={toggleTheme} />
      <Explore />
      <Footer />

    </>
  );
}

// Exporterar App-komponenten för användning i andra delar av appen 

export default App;
