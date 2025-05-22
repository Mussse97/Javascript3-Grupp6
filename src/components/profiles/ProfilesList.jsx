// Importerar nödvändiga bibliotek och komponenter samt React och useParams för att hämta parametrar från URL:en
import React, { useEffect, useState } from "react";
import { writeClient } from '../../sanityClient';
import { Link } from 'react-router-dom';
import './ProfilesList.css';

// Exporterar en funktionell komponent för att visa en lista med användarprofiler 
export default function ProfilesList() {
    const [users, setUsers] = useState(null);
    // Definierar en funktion för att hämta användarprofiler från Sanity CMS med hjälp av Sanity writeClient
    // och sätter dem i komponentens tillstånd med useState-hooken
    useEffect(() => {
        writeClient
            .fetch('*[_type=="user"]{ _id, username, bio }')
            .then(setUsers)
            .catch(console.error);
    }, []);
    // Renderar komponenten med hjälp av JSX och visar en lista med användarprofiler
    // beroende på om användaren är inloggad eller inte (OBS! FUNKTIONALITET FÖR INLOGGNING ÄR INTE IMPLEMENTERAD ÄNNU)
    if (!users) return <p>Laddar användarprofiler...</p>;

    // Visar en lista med användarprofiler med länkar till deras respektive profiler och en kort beskrivning av varje användare
    return (
        <section className="profiles-list">
            <div> {/*OBS SPARA SPECIFIKT DENNA DIV FÖR ATT CSS SKA FUNGERA KORREKT*/}
                <h2>Användarprofiler</h2>
                <ul>
                    {users.map(u => (
                        <li key={u._id}>
                            <Link to={`/profile/${u._id}`}>
                                <strong>{u.username}</strong>
                            </Link>
                            <p>{u.bio?.slice(0, 60) || '_'}</p>
                        </li>
                    ))}
                </ul>
            </div> {/*OBS SPARA SPECIFIKT DENNA DIV FÖR ATT CSS SKA FUNGERA KORREKT*/}
        </section>
    );
}
