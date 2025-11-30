import { useState } from "react";
// Import the base URL configuration from your API setup
import { API_BASE } from "../api/person-api";
import { useNavigate } from "react-router-dom";

// 🎨 Define simple styles for structure and components (Matching LoginPage)
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
    },
    formBox: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '10px',
        margin: '8px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
        boxSizing: 'border-box',
    },
    submitButton: {
        padding: '10px',
        marginTop: '20px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#28a745', // Use a standard green for success/register
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    linkButton: {
        textAlign: 'center',
        marginTop: '15px',
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
    }
};

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        try {
            // 🛠️ FIX 1: Use the centralized API_BASE URL for reliable routing via Traefik
            const url = `${API_BASE}`; // API_BASE is likely http://localhost/api_person/people

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, password, age: Number(age), address, role: "USER" }) // 💡 Added default role
            });

            if (!response.ok) {
                // Read the server's error message if available
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed due to server error.");
            }

            alert("Account created successfully! You can now log in.");
            navigate("/login"); // Use React Router navigate hook
        } catch (err) {
            console.error(err);
            // Show the actual server error message if present
            alert(err.message || "Error creating account.");
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.formBox}>
                <h2 style={styles.title}>Register Account</h2>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        placeholder="Address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />

                    <button type="submit" style={styles.submitButton}>Register</button>
                </form>

                <div style={styles.linkButton} onClick={() => navigate("/login")}>
                    Already have an account? Login here.
                </div>
            </div>
        </div>
    );
}

// NOTE: You must export API_BASE from your person-api.js file for this to work:
// // In person-api.js:
// export const API_BASE = "http://localhost/api_person/people";
