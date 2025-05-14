import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Musiclist() {
  const [music, setMusic] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "music" && defined(slug.current)]{_id, title, slug, cover, review}`
      )
      .then((data) => setMusic(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Music</h1>
      {music.map((music) => (
        <div key={music._id}>
          <li>
            <Link to={`/music/${music.slug.current}`}>
              <h2>{music.title}</h2>
            </Link>
          </li>
          {music.cover && (
            <img src={urlFor(music.cover).width(400).url()} alt={music.title} />
          )}
          <p>{music.review}</p>
        </div>
      ))}
    </div>
  );
}
