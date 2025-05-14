import Booklist from "./components/books/booklist";
import Gamelist from "./components/games/gamelist";
import Movielist from "./components/movies/movielist";
import Musiclist from "./components/music/musiclist";

export default function Home() {
  return (
    <div>
      <Movielist />
      <Booklist />
      <Gamelist />
      <Musiclist />
    </div>
  );
}
