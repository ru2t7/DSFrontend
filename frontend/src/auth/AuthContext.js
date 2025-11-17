import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            setUser(jwtDecode(token));
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, user }}>
            {children}
        </AuthContext.Provider>
    );
}
