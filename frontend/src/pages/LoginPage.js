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
            // ✅ Call the login API and extract the JWT string
            const { token } = await login(username, password); // destructure token from response

            // ✅ Store the JWT in context
            setToken(token);

            // ✅ Optionally store it in localStorage for persistence across reloads
            localStorage.setItem("token", token);

            // ✅ Redirect to PeoplePage
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
