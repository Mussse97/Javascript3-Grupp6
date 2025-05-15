// Importerar React och Header-komponenten 
import React from 'react';
import { Header } from './components/Header';

// Importerar Header-komponenten från components-mappen 
const App = () => {
  return (
    <>
      <Header />
    </>
  );
};

// Exporterar App-komponenten för användning i andra delar av applikationen  
export default App;
