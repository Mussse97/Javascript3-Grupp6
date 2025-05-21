
import React, { useState, useEffect } from 'react';
import './CreatePost.css';
import { client, writeClient } from '../../sanityClient';


// komponenten används för att skapa nya inlägg
function CreatePost() {
  const [post, setPost] = useState({

    title: '',
    category: '',
    year: '',
    producer: '',
    genre: '',
    body: '',
  });

  const [categories, setCategories] = useState([]); // Hämta kategorier
  const [genres, setGenres] = useState([]); // Hämta genrer
  const [filteredGenres, setFilteredGenres] = useState([]);   // Filtrera genrer baserat på vald kategori
  const [message, setMessage] = useState(''); // Meddelande för publicering
  
  // Hämta kategorier och genrer från Sanity
  useEffect(() => {
    const fetchData = async () => {
      const fetchedCategories = await client.fetch(`*[_type == "category"]{_id, title}`);
      const fetchedGenres = await client.fetch(`*[_type == "genre"]{_id, title, category->{_id, title}}`);
      setCategories(fetchedCategories);
      setGenres(fetchedGenres);
    };
    fetchData();
  }, []);

  // Uppdatera filtrerade genres när kategori ändras
  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat.title === post.category);
    if (selectedCategory) {
      const relatedGenres = genres.filter((g) => g.category?._id === selectedCategory._id);
      setFilteredGenres(relatedGenres);
    } else {
      setFilteredGenres([]);
    }
    setPost((prev) => ({ ...prev, genre: '' })); // Töm vald genre
  }, [post.category, genres, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const selectedCategory = categories.find((cat) => cat.title === post.category);
    const selectedGenre = genres.find((g) => g.title === post.genre && g.category?._id === selectedCategory?._id);

    if (!selectedCategory || !selectedGenre) {
      setMessage('Välj en giltig kategori och genre.');
      return;
    }

   const newPost = {
    _type: 'post',
    title: post.title,
    slug: {
      _type: 'slug',
      // ser till att slug alltid fungerar och förhindrar ÅÄÖ + versaler
      current: post.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .slice(0, 96),
    },
    category: {
      _type: 'reference',
      _ref: selectedCategory._id,
    },
    year: parseInt(post.year, 10),
    producer: post.producer,
    genres: [
      {
        _type: 'reference',
        _ref: selectedGenre._id,
        _key: crypto.randomUUID(),
      },
    ],
    body: post.body,
    createdAt: new Date().toISOString(),
};


    try {
      await writeClient.create(newPost);
      setMessage('Inlägget har publicerats!');
      setPost({
        title: '',
        category: '',
        year: '',
        producer: '',
        genre: '',
        body: '',
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Fel vid publicering:", error);
      setMessage("Ett fel uppstod. Försök igen.");
    }
  };

  return (
    <section className="create-post-wrapper">
      <form onSubmit={handleSubmit} className="create-post-form">
        <h2>Skapa nytt inlägg</h2>
        {message && <p className="success">{message}</p>}

        <section className="form-row">
          <section className="form-group">
            <label htmlFor="title">Titel</label>
            <input
              type="text"
              name="title"
              id="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </section>

          <section className="form-group">
            <label htmlFor="category">Kategori</label>
            <select
              name="category"
              id="category"
              value={post.category}
              onChange={handleChange}
              required
            >
              <option value="">Välj kategori</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </section>

          <section className="form-group">
            <label htmlFor="year">År</label>
            <input
              type="number"
              name="year"
              id="year"
              value={post.year}
              onChange={handleChange}
              placeholder="Ex. 2024"
            />
          </section>
        </section>

        <section className="form-row">
          <section className="form-group">
            <label htmlFor="producer">Producent</label>
            <input
              type="text"
              name="producer"
              id="producer"
              value={post.producer}
              onChange={handleChange}
            />
          </section>

          <section className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              name="genre"
              id="genre"
              value={post.genre}
              onChange={handleChange}
              required
              disabled={!filteredGenres.length}
            >
              <option value="">Välj genre</option>
              {filteredGenres.map((g) => (
                <option key={g._id} value={g.title}>
                  {g.title}
                </option>
              ))}
            </select>
          </section>
        </section>

        <label htmlFor="body">Recension</label>
        <textarea
          name="body"
          id="body"
          rows="5"
          value={post.body}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Publicera</button>
      </form>
    </section>
  );
}

export default CreatePost;
