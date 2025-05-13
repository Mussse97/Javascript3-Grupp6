import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Movielist() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "movies"]`)
      .then((data) => setMovies(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {movies.map((movie) => (
        <div key={movie._id}>
          <h2>{movie.title}</h2>
          {movie.cover && (
            <img src={urlFor(movie.cover).width(400).url()} alt={movie.title} />
          )}
          <p>{movie.review}</p>
        </div>
      ))}
    </div>
  );
}
