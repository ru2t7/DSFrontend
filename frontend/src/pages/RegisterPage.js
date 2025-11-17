import { useState } from "react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");

    async function submit(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/people", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, password, age: Number(age), address })
            });
            if (!response.ok) throw new Error("Registration failed");
            alert("Account created successfully! You can now log in.");
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            alert("Error creating account");
        }
    }

    return (
        <form onSubmit={submit}>
            <h2>Register</h2>

            <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
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
            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
                required
            />
            <input
                placeholder="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
            />

            <button type="submit">Register</button>
        </form>
    );
}
