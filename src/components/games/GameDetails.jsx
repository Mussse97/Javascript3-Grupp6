import { useParams } from "react-router-dom";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { useState } from "react";
import { useEffect } from "react";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function GameDetails() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "games" && slug.current == $slug][0]{title, slug, cover, review}`,
        { slug }
      )
      .then((data) => setGame(data))
      .catch(console.error);
  }, [slug]);

  if (!game) return <div>Laddar ...</div>;

  return (
    <div>
      <h1>{game.title}</h1>
      {game.cover && (
        <img src={urlFor(game.cover).width(600).url()} alt={game.title} />
      )}
      <p>{game.review}</p>
    </div>
  );
}
