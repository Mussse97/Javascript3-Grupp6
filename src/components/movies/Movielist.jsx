import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Movielist() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "movies" && defined(slug.current)]{_id, title, slug, cover, review}`
      )
      .then((data) => setMovies(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Movies</h1>
      {movies.map((movie) => (
        <div key={movie._id}>
          <li>
            <Link to={`/movies/${movie.slug.current}`}>
              <h2>{movie.title}</h2>
            </Link>
          </li>
          {movie.cover && (
            <img src={urlFor(movie.cover).width(400).url()} alt={movie.title} />
          )}
          <p>{movie.review}</p>
        </div>
      ))}
    </div>
  );
}
