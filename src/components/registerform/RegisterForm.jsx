import React, { useState } from "react";
import "./RegisterForm.css";
import { writeClient } from "../../sanityClient";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!formData.username || !formData.email) {
      setError("Användarnamn och e-post är obligatoriska fält.");
      setLoading(false);
      return;
    }

    try {
      const userDoc = {
        _type: "user",
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        createdAt: new Date().toISOString(),
      };

      await writeClient.create(userDoc);
      setSuccessMsg("Registrering lyckades!");
      setFormData({
        username: "",
        email: "",
        bio: "",
      });
    } catch (err) {
      console.error(err);
      setError("Ett fel inträffade vid registreringen. Försök igen senare.");
    } finally {
      setLoading(false);
    }

    try {
      await writeClient.create({
        _type: "user",
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        createdAt: new Date().toISOString(),
      });

      setSuccessMsg("Registrering lyckades!");
      setFormData({ username: "", email: "", bio: "" });
    } catch (err) {
      setError("Ett fel inträffade:" + err.message);
    }
    setLoading(false);
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Skapa konto</h2>
      <label>
        Användarnamn:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        E-post:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Om mig:
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
          placeholder="Skriv något om dig själv (valfritt)"
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Registrerar..." : "Registrera"}
      </button>
      {error && <p className="error">{error}</p>}
      {successMsg && <p className="success">{successMsg}</p>}
    </form>
  );
};

export default RegisterForm;
