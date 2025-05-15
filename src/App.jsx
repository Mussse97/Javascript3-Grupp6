import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header';
import Footer from './components/footer/Footer';
import Explore from './components/Explore';
import CreatePost from './components/CreatePost'; 

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
