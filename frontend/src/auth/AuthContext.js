// import { createContext, useState, useEffect } from "react";
// import { jwtDecode } from 'jwt-decode';
//
// export const AuthContext = createContext();
//
// export function AuthProvider({ children }) {
//     const [token, setToken] = useState(localStorage.getItem("token"));
//     const [user, setUser] = useState(null);
//
//     useEffect(() => {
//         if (token) {
//             localStorage.setItem("token", token);
//             setUser(jwtDecode(token));
//         } else {
//             localStorage.removeItem("token");
//             setUser(null);
//         }
//     }, [token]);
//
//     return (
//         <AuthContext.Provider value={{ token, setToken, user }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Initial state reads token from storage
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [isAuthResolved, setIsAuthResolved] = useState(false); // ⬅️ CRITICAL NEW STATE

    // Effect 1: Handles the initial load/resolution check
    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
            try {
                // We trust the token is valid for decoding here, validation happens on API call
                setUser(jwtDecode(storedToken));
            } catch (error) {
                // If decoding fails, treat as logged out
                localStorage.removeItem("token");
                setToken(null);
            }
        }

        // This MUST be the last action of the initial load
        setIsAuthResolved(true);

    }, []); // Run only once on mount

    // Effect 2: Handles token changes (login/logout)
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            try {
                setUser(jwtDecode(token));
            } catch (e) {
                setUser(null);
            }
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }
    }, [token]);

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, setToken, user, isAuthenticated, isAuthResolved }}>
            {children}
        </AuthContext.Provider>
    );
}
