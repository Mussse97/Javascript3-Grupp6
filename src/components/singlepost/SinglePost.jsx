import { useParams } from "react-router-dom";
import { client, writeClient } from "../../sanityClient";
import { useState } from "react";
import { useEffect } from "react";
import "./SinglePost.css";

export default function SinglePost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  // Hämtar data från Sanity
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

  // Hanterar inskickning av kommentarer:
  // 1. Validerar att både namn och kommentar är ifyllda
  // 2. Skapar ett nytt kommentarsobjekt med aktuell tidstämpel
  // 3. Skickar till databasen och uppdaterar lokalt state för snabb respons
  // 4. Återställer formuläret vid lyckad inskickning
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      return window.confirm("Du måste fylla i både namn och kommentar.");
    }

    const newComment = {
      _key: new Date().toISOString(),
      name,
      comment,
      createdAt: new Date().toISOString(),
    };

    try {
      await writeClient
        .patch(post._id)
        .setIfMissing({ comments: [] })
        .append("comments", [newComment])
        .commit();

      // lägger till kommentaren direkt i state
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      // Återställer formulär och visar bekräftelse
      setSuccessMsg("Kommentar skickad!");
      setName("");
      setComment("");
    } catch (error) {
      console.error("Misslyckades att skicka kommentar", error);
    }
  };

  if (!post) return <div>Laddar...</div>;

  return (
    <div className="single-post-wrapper">
      <section className="single-post">
        <h1>{post.title}</h1>
        <div className="post-info">
          <p>År: {post.year}</p>
          <p>Producent: {post.producer}</p>
          <p>Kategori: {post.category?.title}</p>
          <p>Genrer: {post.genres?.map((g) => g.title).join(", ")}</p>
          <p>Inehåll: {post.body}</p>
        </div>
      </section>
      <section className="comment-wrapper">
        <h2>Kommentarer: </h2>
        {post.comments?.length > 0 ? (
          post.comments.map((comment, id) => (
            <div key={id} className="comment-container">
              <strong>{comment.name}</strong> (
              {new Date(comment.createdAt).toLocaleDateString()}):
              <p className="comment-text">{comment.comment}</p>
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
        {successMsg && <p style={{ color: "limegreen" }}>{successMsg}</p>}
      </section>
    </div>
  );
}
