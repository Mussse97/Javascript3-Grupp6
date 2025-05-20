import React, { useState } from "react";
import "./CreatePost.css";
import { client } from "../../sanityClient";

function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    category: "film",
    year: "",
    producer: "",
    genre: "",
    content: "",
  });

  const [message, setMessage] = useState("");

  const genreOptions = {
    film: ["Action", "Drama", "Thriller", "Fantasy"],
    musik: ["Pop", "Jazz"],
    böcker: ["Roman", "Kurslitteratur", "Fantasy"],
    spel: ["Action", "RPG", "Moba", "Fantasy"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setPost((prev) => ({
        ...prev,
        category: value,
        genre: "", // Nollställ genre om kategori ändras
      }));
    } else {
      setPost((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      _type: "post",
      title: post.title,
      category: post.category,
      year: post.year,
      producer: post.producer,
      genre: post.genre,
      content: post.content,
      createdAt: new Date().toISOString(),
    };

    try {
      await client.create(newPost);
      setMessage("Inlägget har publicerats!");

      setPost({
        title: "",
        category: "film",
        year: "",
        producer: "",
        genre: "",
        content: "",
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Fel vid publicering:", error);
      setMessage("Ett fel uppstod. Försök igen.");
    }
  };

  return (
    <div className="create-post-wrapper">
      <form onSubmit={handleSubmit} className="create-post-form">
        <h2>Skapa nytt inlägg</h2>
        {message && <p className="success">{message}</p>}

        {/* Rad 1: Titel, Kategori, År */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Titel</label>
            <input
              type="text"
              name="title"
              id="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <select
              name="category"
              id="category"
              value={post.category}
              onChange={handleChange}
            >
              <option value="film">Film</option>
              <option value="musik">Musik</option>
              <option value="böcker">Böcker</option>
              <option value="spel">Spel</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year">År</label>
            <input
              type="number"
              name="year"
              id="year"
              value={post.year}
              onChange={handleChange}
              placeholder="Ex. 2024"
            />
          </div>
        </div>

        {/* Rad 2: Producent, Genre */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="producer">Producent</label>
            <input
              type="text"
              name="producer"
              id="producer"
              value={post.producer}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              name="genre"
              id="genre"
              value={post.genre}
              onChange={handleChange}
              required
            >
              <option value="">Välj genre</option>
              {genreOptions[post.category].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recension */}
        <label htmlFor="content">Recension</label>
        <textarea
          name="content"
          id="content"
          rows="5"
          value={post.content}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Publicera</button>
      </form>
    </div>
  );
}

export default CreatePost;
