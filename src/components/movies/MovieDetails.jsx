import { useParams } from "react-router-dom";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { useState } from "react";
import { useEffect } from "react";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function MovieDetails() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "movies" && slug.current == $slug][0]{title, slug, cover, review}`,
        { slug }
      )
      .then((data) => setMovie(data))
      .catch(console.error);
  }, [slug]);

  if (!movie) return <div>Laddar ...</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      {movie.cover && (
        <img src={urlFor(movie.cover).width(600).url()} alt={movie.title} />
      )}
      <p>{movie.review}</p>
    </div>
  );
}
