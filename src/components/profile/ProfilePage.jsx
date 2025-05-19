import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client, writeClient } from "../../sanityClient";
import { useAuth } from "../../hooks/useAuth";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: loggedIn } = useAuth();
  const isMe = loggedIn?._id === id;
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ username: "", bio: "" });
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    client
      .fetch('*[_type=="user" && _id==$id][0]', { id })
      .then((p) => {
        setProfile(p);
        setForm({ username: p.username, bio: p.bio || "" });
      })
      .catch(console.error);
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setMsg("Sparar...");
    try {
      await writeClient.patch(id).set(form).commit();
      setProfile({ ...profile, ...form });
      setEdit(false);
      setMsg("Profilen sparad!");
    } catch (err) {
      setMsg("Något gick fel. Försök igen.");
      console.error(err);
    }
  };

  if (!profile) return <p>Laddar profil...</p>;

  return (
    <section className="profile-page">
      <h2>{isMe ? "Min profil" : `Profil: ${profile.username}`}</h2>

      {!edit && (
        <>
          <p>
            <strong>Användarnamn:</strong> {profile.username}
          </p>
          <p>
            <strong>Om mig:</strong> {profile.bio || "_"}
          </p>
          {isMe && <button onClick={() => setEdit(true)}>Redigera</button>}
        </>
      )}

      {edit && (
        <>
          <label>
            Användarnamn:
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Om mig:
            <textarea
              name="bio"
              rows="4"
              value={form.bio}
              onChange={handleChange}
            />
          </label>
          <button onClick={save}>Spara</button>
          <button onClick={() => setEdit(false)}>Avbryt</button>
        </>
      )}
      {msg && <p className="msg">{msg}</p>}
    </section>
  );
}
