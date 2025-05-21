// Importerar nödvändiga bibliotek och komponenter
import React, { useState } from "react";
import "./RegisterForm.css";
import { writeClient } from "../../sanityClient";

// Skapar en funktionell komponent för registreringsformuläret
// Denna komponent används för att registrera en ny användare genom att skicka deras information till Sanity CMS
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Definierar en funktion för att hantera ändringar i formuläret och uppdatera komponentens tillstånd med hjälp av useState-hooken
  // Funktion anropas när användaren skriver in sina uppgifter i registreringsformuläret
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // Definierar en funktion för att hantera formulärinlämning och skicka användarens information till Sanity CMS med hjälp av Sanity writeClient
  // och uppdaterar komponentens tillstånd med den nya informationen
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    // Validerar att användarnamn och e-postadress är ifyllda innan registreringen skickas
    // Om något av fälten är tomt visas ett felmeddelande
        if (!formData.username || !formData.email) {
            setError('Användarnamn och e-post är obligatoriska fält.');
            setLoading(false);
            return;
        }
        
        try {
            await writeClient.create({
                _type: 'user',
                username: formData.username,
                email: formData.email,
                bio: formData.bio,
                createdAt: new Date().toISOString(),
            });

            setSuccessMsg('Registrering lyckades!');
            setFormData({ username: '', email: '', bio: '' });
        } catch (err) {
            setError('Ett fel inträffade: ' + err.message);
        }

        setLoading(false);
    };

    // Renderar komponenten med hjälp av JSX och visar registreringsformuläret
    // beroende på om användaren är inloggad eller inte (OBS! FUNKTIONALITET FÖR INLOGGNING ÄR INTE IMPLEMENTERAD ÄNNU)
    return (
        <section className="register-form">
            <section>
                <form onSubmit={handleSubmit}>
                    <h2>Skapa konto</h2>
                    <label>
                        Användarnamn:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required />
                    </label>
                    <label>
                        E-post:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required />
                    </label>
                    <label>
                        Om mig:
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Skriv något om dig själv (valfritt)" />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registrerar...' : 'Registrera'}
                    </button>
                    {error && <p className="error">{error}</p>}
                    {successMsg && <p className="success">{successMsg}</p>}
                </form>
            </section>
        </section>
    );
};

// Exporterar RegisterForm-komponenten så att den kan användas i andra delar av applikationen 
export default RegisterForm;
