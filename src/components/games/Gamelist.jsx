import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Gamelist() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "games" && defined(slug.current)]{_id, title, slug, cover, review}`
      )
      .then((data) => setGames(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Games</h1>
      {games.map((game) => (
        <div key={game._id}>
          <li>
            <Link to={`/games/${game.slug.current}`}>
              <h2>{game.title}</h2>
            </Link>
          </li>
          {game.cover && (
            <img src={urlFor(game.cover).width(400).url()} alt={game.title} />
          )}
          <p>{game.review}</p>
        </div>
      ))}
    </div>
  );
}
