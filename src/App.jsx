
// Importerar nödvändiga bibliotek och komponenter 
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/footer/Footer';
import { Header } from './components/Header';
import './App.css';
import Explore from './components/Explore';
import RegisterForm from './components/registerform/RegisterForm';
//                 


// Definierar huvudkomponenten för appen som hanterar mörkt/ljust läge och renderar andra komponenter
function App() {
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

      <Router>
      <Header toggleTheme={toggleTheme} />
      
      <Routes>
        {/* Startsida / explore */}
        <Route path="/" element={<Explore />} />

        {/* Registreringssida */}
        <Route path="/register" element={<RegisterForm />} />
        
        {/* ev. fler routes här */}
      </Routes>

      <Footer />
    </Router>

    </>
  );
}

// Exporterar App-komponenten för användning i andra delar av appen 
export default App;
