// src/components/NavigationBar.js
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function NavigationBar() {
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!token) return null;

    let roles = [];
    try {
        const decoded = jwtDecode(token);
        console.log(jwtDecode(token));
        roles = decoded.roles || (decoded.role ? [decoded.role] : []);
    } catch(err) {
        console.error("Failed to decode JWT", err);
    }

    function logout() {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            {roles.includes("ADMIN") && <Link to="/people">People</Link>}
            <Link to="/devices">Devices</Link>
            <button onClick={logout}>Logout</button>
        </nav>
    );
}
