
// Importerar React och Header-komponenten 
import React from 'react';
import { Header } from './components/Header';
import { useState } from 'react'
import './App.css'
import Explore from './components/Explore'

function App() {
  
  return (
    <>

      <Header />
      <Explore/>
    </>
  )

}
export default App


