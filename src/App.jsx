// Importerar nödvändiga bibliotek och komponenter 
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from './components/Header';
import SinglePost from "./components/singlepost/SinglePost";
import Footer from './components/footer/Footer';
import Explore from './components/explore/Explore';
import CreatePost from './components/createPost/CreatePost'; 
import RegisterForm from './components/registerform/RegisterForm';
import ProfilesList from './components/profiles/ProfilesList';
import ProfilePage  from './components/profile/ProfilePage';
import './App.css';
import Startsida from './components/startsida/Startsida';

// Definierar App-komponenten som är huvudkomponenten för applikationen och innehåller alla andra komponenter
// samt hanterar navigering mellan dem samt funktionalitet för växling mellan mörkt/ljust läge
function App() {
      const [isDarkMode, setIsDarkMode] = useState(true);
      const toggleTheme = () => setIsDarkMode(prev => !prev);
      // useState-hooken hanterar tillståndet för mörkt/ljust läge, toggleTheme-funktionen växlar mellan lägena
      useEffect(() => {
        document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
      }, [isDarkMode]);
      // useEffect-hooken används, uppdaterar klassnamnet på body-elementet på det aktuella läget (mörkt eller ljust)
  
  // Renderar komponenten med hjälp av JSX och visar Header, Footer och Routes
  return (
    <>
      <Header toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<Startsida/>} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/post/:slug" element={<SinglePost />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profiles" element={<ProfilesList />} />     {/* lista */}
        <Route path="/profile/:id" element={<ProfilePage />} />   {/* individuell */}
        <Route path="/register" element={<RegisterForm />} />
      </Routes>

      <Footer />
    </>
  );
}

// App-komponenten är huvudkomponenten för applikationen och innehåller alla andra komponenter
// Den använder React Router för att hantera navigering mellan olika sidor och komponenter
export default App;
