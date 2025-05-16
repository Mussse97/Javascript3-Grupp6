import { useParams } from "react-router-dom";
import { client } from "../../sanityClient";
import { useState } from "react";
import { useEffect } from "react";

export default function SinglePost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{_id,
        title,
        slug,
        year,
        producer,
        category->{title},
        genres[]->{title},
        body}`,
        { slug }
      )
      .then((data) => setPost(data))
      .catch(console.error);
  }, [slug]);

  if (!post) return <div>Laddar...</div>;

  return (
    <div className="posts-section">
      <h1>{post.title}</h1>
      <p>År: {post.year}</p>
      <p>Producent: {post.producer}</p>
      <p>Kategori: {post.category?.title}</p>
      <p>Genrer: {post.genres?.map((g) => g.title).join(", ")}</p>
      <p>Inehåll: {post.body}</p>
    </div>
  );
}
