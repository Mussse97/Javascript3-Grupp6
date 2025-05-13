import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Gamelist() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "games"]`)
      .then((data) => setGames(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {games.map((game) => (
        <div key={game._id}>
          <h2>{game.title}</h2>
          {game.cover && (
            <img src={urlFor(game.cover).width(400).url()} alt={game.title} />
          )}
          <p>{game.review}</p>
        </div>
      ))}
    </div>
  );
}
