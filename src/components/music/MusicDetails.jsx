import { useParams } from "react-router-dom";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { useState } from "react";
import { useEffect } from "react";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function MusicDetails() {
  const { slug } = useParams();
  const [music, setMusic] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "music" && slug.current == $slug][0]{title, slug, cover, review}`,
        { slug }
      )
      .then((data) => setMusic(data))
      .catch(console.error);
  }, [slug]);

  if (!music) return <div>Laddar ...</div>;

  return (
    <div>
      <h1>{music.title}</h1>
      {music.cover && (
        <img src={urlFor(music.cover).width(600).url()} alt={music.title} />
      )}
      <p>{music.review}</p>
    </div>
  );
}
