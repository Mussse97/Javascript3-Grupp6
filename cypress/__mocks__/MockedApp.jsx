/* eslint-disable no-undef */

/// <reference types="cypress" />

// Mockade komponenter för att användas i tester
import React, { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Header,
  Explore,
  SinglePost,
  CreatePost,
  ProfilesList,
  ProfilePage,
  RegisterForm,
  Startsida,
  Footer
} from './MockedComponents';

// MockedApp är en komponent som simulerar en applikation med olika rutter och teman
function MockedApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  // Använder useEffect för att ändra dokumentets klassnamn baserat på tema 
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);
  
  // Returnerar en Router med olika rutter och en Header och Footer 
  return (
    <Router initialEntries={['/']}>
      <Header toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Startsida />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/post/:slug" element={<SinglePost />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profiles" element={<ProfilesList />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

// Exporterar MockedApp för att kunna användas i tester 
export default MockedApp;
