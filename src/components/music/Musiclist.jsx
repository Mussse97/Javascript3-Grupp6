import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Musiclist() {
  const [music, setMusic] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "music"]`)
      .then((data) => setMusic(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {music.map((music) => (
        <div key={music._id}>
          <h2>{music.title}</h2>
          {music.cover && (
            <img src={urlFor(music.cover).width(400).url()} alt={music.title} />
          )}
          <p>{music.review}</p>
        </div>
      ))}
    </div>
  );
}
