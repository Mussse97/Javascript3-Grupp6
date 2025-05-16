// Importerar nödvändiga bibliotek och komponenter
import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import SinglePost from "./components/singlepost/SinglePost";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/Footer";
import Explore from "./components/explore/Explore";
import CreatePost from "./components/createpost/CreatePost";

// Definierar huvudkomponenten för appen som hanterar mörkt/ljust läge och renderar andra komponenter
function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  // useState-hooken hanterar tillståndet för mörkt/ljust läge, toggleTheme-funktionen växlar mellan lägena
  useEffect(() => {
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
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

// Exporterar App-komponenten för användning i andra delar av appen

export default App;
