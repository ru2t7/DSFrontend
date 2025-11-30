import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { login } from "../api/person-api";
import { useNavigate } from "react-router-dom";

// 🎨 Define simple styles for structure and components
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5', // Light gray background
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
        boxSizing: 'border-box', // Include padding in the element's total width and height
    },
    loginButton: {
        padding: '10px',
        marginTop: '20px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff', // Primary blue color
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    registerButton: {
        padding: '10px',
        marginTop: '10px',
        borderRadius: '4px',
        border: '1px solid #007bff',
        backgroundColor: 'transparent',
        color: '#007bff',
        fontSize: '16px',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    }
};

export default function LoginPage() {
    const { setToken } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        try {
            console.log("Attempting login with:", { username });

            const response = await login(username, password);
            console.log("Login Response:", response);

            if (!response || !response.token) {
                throw new Error("No token received from server!");
            }

            const { token } = response;
            setToken(token);
            localStorage.setItem("token", token);
            navigate("/");
        } catch {
            alert("Invalid login");
        }
    }

    function goToRegister() {
        navigate("/register");
    }

    return (
        <div style={styles.container}>
            <div style={styles.formBox}>
                <h2 style={styles.title}>Welcome Back</h2>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <button type="submit" style={styles.loginButton}>Login</button>
                </form>

                <button onClick={goToRegister} style={styles.registerButton}>
                    Register
                </button>
            </div>
        </div>
    );
}
