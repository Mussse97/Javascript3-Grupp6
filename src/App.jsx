import MovieDetails from "./components/movies/MovieDetails";
import BookDetails from "./components/books/BookDetails";
import GameDetails from "./components/games/GameDetails";
import MusicDetails from "./components/music/MusicDetails";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:slug" element={<MovieDetails />} />
          <Route path="/books/:slug" element={<BookDetails />} />
          <Route path="/games/:slug" element={<GameDetails />} />
          <Route path="/music/:slug" element={<MusicDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
