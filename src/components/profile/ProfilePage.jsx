// Importerar nödvändiga bibliotek och komponenter samt React och useParams för att hämta parametrar från URL:en
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client, writeClient } from "../../sanityClient";
import { useAuth } from "../../hooks/useAuth";
import "./ProfilePage.css";

// Exporterar en funktionell komponent för profil sidan som visar användarens profilinformation och tillåter redigering av den
export default function ProfilePage() {
  const { id } = useParams();
  const { user: loggedIn } = useAuth();
  const isMe = loggedIn?._id === id;
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ username: "", bio: "" });
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Definierar en funktion för att hämta användarens profilinformation från Sanity CMS med hjälp av Sanity client
  // och sätter den i komponentens tillstånd med useState-hooken
  useEffect(() => {
    client
      .fetch('*[_type=="user" && _id==$id][0]', { id })
      .then((p) => {
        setProfile(p);
        setForm({ username: p.username, bio: p.bio || "" });
      })
      .catch(console.error);
  }, [id]);

  // Definierar en funktion för att hantera ändringar i formuläret och uppdatera komponentens tillstånd med hjälp av useState-hooken
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Definierar en funktion för att spara ändringar i användarens profilinformation i Sanity CMS med hjälp av Sanity writeClient
  // och uppdaterar komponentens tillstånd med den nya informationen
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
  // Renderar komponenten med hjälp av JSX och visar användarens profilinformation, redigeringsalternativ och meddelanden
  // beroende på om användaren är inloggad eller inte (OBS! FUNKTIONALITET FÖR INLOGGNING ÄR INTE IMPLEMENTERAD ÄNNU)
  if (!profile) return <p>Laddar profil...</p>;

  // Visar profilinformation och redigeringsalternativ beroende på om användaren är inloggad eller inte 
  // och om de är den aktuella användaren eller inte ((OBS! FUNKTIONALITET FÖR INLOGGNING ÄR INTE IMPLEMENTERAD ÄNNU))
  return (
    <section className="profile-page">
      <div> {/*OBS SPARA SPECIFIKT DENNA DIV FÖR ATT CSS SKA FUNGERA KORREKT*/}
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
      </div> {/*OBS SPARA SPECIFIKT DENNA DIV FÖR ATT CSS SKA FUNGERA KORREKT*/}
    </section>
  );

}