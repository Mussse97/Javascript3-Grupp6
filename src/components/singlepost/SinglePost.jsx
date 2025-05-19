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
        `*[_type == "post" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          year,
          producer,
          category->{title},
          genres[]->{title},
          body,
          comments[]{
            name,
            comment,
            createdAt
          }
        }`,
        { slug }
      )
      .then((data) => setPost(data))
      .catch(console.error);
  }, [slug]);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newComment = {
      name,
      comment,
      createdAt: new Date().toISOString(),
    };

    try {
      await client
        .patch(post._id)
        .setIfMissing({ comments: [] })
        .append("comments", [newComment])
        .commit();

      // Lägg till kommentaren lokalt utan ny fetch
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      setSuccessMsg("Kommentar skickad!");
      setName("");
      setComment("");
    } catch (error) {
      console.error("Misslyckades att skicka kommentar", error);
    }
  };

  if (!post) return <div>Laddar...</div>;

  return (
    <>
      <div className="posts-section">
        <h1>{post.title}</h1>
        <p>År: {post.year}</p>
        <p>Producent: {post.producer}</p>
        <p>Kategori: {post.category?.title}</p>
        <p>Genrer: {post.genres?.map((g) => g.title).join(", ")}</p>
        <p>Inehåll: {post.body}</p>
      </div>
      <div className="comment">
        <h2>Kommentarer</h2>
        {post.comments?.length > 0 ? (
          post.comments.map((c, idx) => (
            <div key={idx}>
              <strong>{c.name}</strong> (
              {new Date(c.createdAt).toLocaleDateString()}):
              <p>{c.comment}</p>
            </div>
          ))
        ) : (
          <p>Inga kommentarer än.</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ditt namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Din kommentar"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Skicka kommentar</button>
        </form>
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      </div>
    </>
  );
}
