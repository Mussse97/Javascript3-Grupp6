import { Routes, Route } from 'react-router-dom';
import Startsida from './pages/startsida/startsida.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Startsida />} />
    </Routes>
  );
}

export default App;