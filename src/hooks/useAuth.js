// Det här är en anpassad hook för autentisering som hanterar inloggning, utloggning och lagring av användardata i localStorage
import { useState, useEffect } from 'react';

// Använd denna hook i dina komponenter för att hantera autentisering
export function useAuth() {
    const [user, setUser] = useState(null);
    // När komponenten laddas, kollas om det finns en användare i localStorage, om det finns, sätts användaren i state
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    
    // Funktioner för att logga in och ut som kan anropas från komponenter för att hantera autentisering
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };
    
    // Denna funktion loggar ut användaren genom att sätta användaren i state till null och ta bort användardata från localStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };
    
    // Returnerar användardata och funktioner för inloggning och utloggning så de kan användas i komponenter
    return { user, login, logout };
}