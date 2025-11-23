import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { login } from "../api/person-api";
import { useNavigate } from "react-router-dom"; // for navigation

export default function LoginPage() {
    const { setToken } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // React Router v6 hook

    async function submit(e) {
        e.preventDefault();
        try {
            console.log("Attempting login with:", { username }); // Debug log

            const response = await login(username, password);
            console.log("Login Response:", response); // See what came back

            // Check if the response actually has a token
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
        navigate("/register"); // navigate to register page
    }

    return (
        <div>
            <form onSubmit={submit}>
                <h2>Login</h2>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>

            <button onClick={goToRegister} style={{ marginTop: "1rem" }}>
                Register
            </button>
        </div>
    );
}
