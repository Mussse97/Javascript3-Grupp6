import Booklist from "./components/books/booklist";
import Gamelist from "./components/games/gamelist";
import Movielist from "./components/movies/movielist";
import Musiclist from "./components/music/musiclist";

function App() {
  return (
    <>
      <Movielist />
      <Booklist />
      <Gamelist />
      <Musiclist />
    </>
  );
}

export default App;
