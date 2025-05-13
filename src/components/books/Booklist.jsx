import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Booklist() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "books"]`)
      .then((data) => setBooks(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {books.map((book) => (
        <div key={book._id}>
          <h2>{book.title}</h2>
          {book.cover && (
            <img src={urlFor(book.cover).width(400).url()} alt={book.title} />
          )}
          <p>{book.review}</p>
        </div>
      ))}
    </div>
  );
}
