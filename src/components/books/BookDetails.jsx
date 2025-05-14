import { useParams } from "react-router-dom";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { useState } from "react";
import { useEffect } from "react";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function BookDetails() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "books" && slug.current == $slug][0]{title, slug, cover, review}`,
        { slug }
      )
      .then((data) => setBook(data))
      .catch(console.error);
  }, [slug]);

  if (!book) return <div>Laddar ...</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      {book.cover && (
        <img src={urlFor(book.cover).width(600).url()} alt={book.title} />
      )}
      <p>{book.review}</p>
    </div>
  );
}
