import { useEffect, useState } from "react";
import { client } from "../../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Booklist() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "books" && defined(slug.current)]{_id, title, slug, cover, review}`
      )
      .then((data) => setBooks(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Books</h1>
      {books.map((book) => (
        <div key={book._id}>
          <li>
            <Link to={`/books/${book.slug.current}`}>
              <h2>{book.title}</h2>
            </Link>
          </li>
          {book.cover && (
            <img src={urlFor(book.cover).width(400).url()} alt={book.title} />
          )}
          <p>{book.review}</p>
        </div>
      ))}
    </div>
  );
}
