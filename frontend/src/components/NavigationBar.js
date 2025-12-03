// src/components/NavigationBar.js
import { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { jwtDecode } from "jwt-decode";

const TARGET_CLIENT_ID = "cdeb048b-1998-42e6-9b61-d69cdc2029cc";

// 🎨 Define the styles object
const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between", // Pushes content to the sides
        alignItems: "center",
        padding: "10px 30px", // Padding top/bottom and sides
        backgroundColor: "#282c34", // Dark background color
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        height: "60px",
    },
    navLinks: {
        display: "flex",
        gap: "20px", // Space between links
        alignItems: "center",
    },
    link: {
        color: "#61dafb", // Bright link color
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "600",
        transition: "color 0.3s ease",
    },
    // Adding hover effects for a better user experience
    linkHover: {
        color: "white",
    },
    button: {
        padding: "8px 16px",
        borderRadius: "4px",
        border: "1px solid #61dafb",
        backgroundColor: "transparent",
        color: "#61dafb",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.3s ease",
    },
    buttonHover: {
        backgroundColor: "#61dafb",
        color: "#282c34",
    }
};

export default function NavigationBar() {
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // The component shouldn't render if the user is not authenticated
    if (!token) return null;

    let roles = [];
    let userId = null;

    try {
        const decoded = jwtDecode(token);
        // console.log(jwtDecode(token)); // Keep this line commented or remove in production
        // Handles both singular 'role' and plural 'roles' claims
        roles = decoded.roles || (decoded.role ? [decoded.role] : []);
        userId = decoded.sub || decoded.name;
    } catch(err) {
        console.error("Failed to decode JWT", err);
        // Fallback: If token is invalid, log out the user
        logout();
        return null;
    }

    const isAdmin = roles.includes("ADMIN");
    // ➡️ 3. Check if the authenticated user's ID matches the target ID
    const isTargetClient = userId && userId === TARGET_CLIENT_ID;

    // Show Monitoring link if user is ADMIN OR if user is the specific TARGET_CLIENT_ID
    const showMonitoringLink = isAdmin || isTargetClient;

    function logout() {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
    }

    // Custom Link component to handle hover state
    const NavLink = ({ to, children }) => {
        const [isHovered, setIsHovered] = useState(false);
        return (
            <Link
                to={to}
                style={isHovered ? { ...styles.link, ...styles.linkHover } : styles.link}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {children}
            </Link>
        );
    };

    // Custom Button component to handle hover state
    const LogoutButton = () => {
        const [isHovered, setIsHovered] = useState(false);
        return (
            <button
                onClick={logout}
                style={isHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                Logout
            </button>
        );
    };


    return (
        <nav style={styles.navbar}>
            <div style={styles.navLinks}>
                {/* Admin Links */}
                {roles.includes("ADMIN") && <NavLink to="/people">User Management</NavLink>}

                {/* Always visible links */}
                <NavLink to="/devices">Devices</NavLink>

                {/* Admin Only Link */}
                {roles.includes("ADMIN") && <NavLink to="/device-assignment">Assign Devices</NavLink>}

                {/* ➡️ DYNAMIC MONITORING LINK */}
                {showMonitoringLink && <NavLink to="/monitoring-data">Monitoring</NavLink>}

            </div>

            <LogoutButton />
        </nav>
    );
}
