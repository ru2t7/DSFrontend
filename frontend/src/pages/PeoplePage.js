import { useEffect, useState } from "react";
import { getPeople, getPersonById, createPerson, updatePerson, deletePerson } from "../api/person-api";
import NavigationBar from "../components/NavigationBar";

// 🎨 Define styles outside or inside the component
const inputStyle = { margin: "5px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" };

export default function PeoplePage() {
    const [people, setPeople] = useState([]);
    const [allAddresses, setAllAddresses] = useState([]);
    // ✅ FIX 1: Initialize form state with 'role'
    const [form, setForm] = useState({
        username: "",
        name: "",
        age: "",
        address: "",
        password: "",
        role: "USER"
    });
    const [editingId, setEditingId] = useState(null);

    const thStyle = {
        padding: "8px",
        borderBottom: "2px solid #ccc",
        textAlign: "left"
    };
    const tdStyle = {
        padding: "8px"
    };

    useEffect(() => {
        loadPeople();
    }, []);

    async function loadPeople() {
        try {
            const data = await getPeople();
            setPeople(data);

            const addresses = data
                .filter(p => p.address)
                .map(p => p.address);
            setAllAddresses([...new Set(addresses)]);
        } catch (err) {
            console.error("Failed to load people", err);
            if(err.response && err.response.status === 401) {
                alert("You are not authorized. Please login.");
            }
        }
    }

    function resetForm() {
        // ✅ Uses the cleaned up state structure
        setForm({ username: "", name: "", age: "", address: "", password: "", role: "USER" });
        setEditingId(null);
    }

    async function handleSubmit() {
        try {
            // ✅ Ensure the payload includes the role
            const payload = { ...form, age: Number(form.age) };
            if (!payload.password) delete payload.password;

            if (editingId) {
                await updatePerson(editingId, payload);
                alert("User updated successfully!");
            } else {
                await createPerson(payload);
                alert("User created successfully!");
            }
            resetForm();
            loadPeople();

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 409) {
                alert("Error: This username is already taken. Please choose another.");
            } else if (err.response && err.response.data) {
                // Try to show server message
                alert(`Error: ${err.response.data.message || "Operation failed"}`);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    }

    async function handleEdit(person) {
        try {
            const personDetails = await getPersonById(person.id);
            setForm({
                username: personDetails.username,
                name: personDetails.name,
                age: personDetails.age,
                address: personDetails.address || "",
                password: "",
                // ✅ FIX 3: Update role when editing
                role: personDetails.role || "USER"
            });
            setEditingId(personDetails.id);
        } catch (err) {
            console.error(err);
            alert("Could not load person details.");
        }
    }

    async function handleDelete(id) {
        try {
            await deletePerson(id);
            loadPeople();
        } catch (err) {
            console.error(err);
            alert("Failed to delete user.");
        }
        // ❌ FIX 2: Removed redundant loadPeople() call here
    }

    return (
        <div>
            <NavigationBar/>
            <div style={{padding: "20px", fontFamily: "Arial, sans-serif"}}>
                <h2>People</h2>
                <div style={{background: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "20px"}}>
                    <h3>{editingId ? "Edit Person" : "Add Person"}</h3>

                    <input
                        style={inputStyle}
                        placeholder="Username"
                        value={form.username}
                        onChange={e => setForm({...form, username: e.target.value})}
                        disabled={!!editingId}
                    />
                    <input
                        style={inputStyle}
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                    />
                    <input
                        style={inputStyle}
                        placeholder="Age"
                        type="number"
                        value={form.age}
                        onChange={e => setForm({...form, age: e.target.value})}
                    />
                    <input
                        style={inputStyle}
                        placeholder="Address"
                        list="addresses"
                        value={form.address}
                        onChange={e => setForm({...form, address: e.target.value})}
                    />
                    <datalist id="addresses">
                        {allAddresses.map(addr => (
                            <option key={addr} value={addr}/>
                        ))}
                    </datalist>

                    {/* ✅ FIX 1: Role Dropdown added to UI */}
                    <select
                        style={inputStyle}
                        value={form.role}
                        onChange={e => setForm({...form, role: e.target.value})}
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <input
                        style={inputStyle}
                        placeholder={editingId ? "New Password (Optional)" : "Password"}
                        type="password"
                        value={form.password}
                        onChange={e => setForm({...form, password: e.target.value})}
                    />

                    <div style={{marginTop: "10px"}}>
                        <button onClick={handleSubmit} style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}>
                            {editingId ? "Update User" : "Add User"}
                        </button>

                        {editingId && (
                            <button onClick={resetForm} style={{
                                padding: "8px 16px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
                <table style={{width: "100%", borderCollapse: "collapse", marginTop: "20px"}}>
                    <thead>
                    <tr style={{background: "#f0f0f0"}}>
                        <th style={thStyle}>Username</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Age</th>
                        <th style={thStyle}>Address</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {people.map(p => (
                        <tr key={p.id} style={{borderBottom: "1px solid #ccc"}}>
                            <td style={tdStyle}>{p.username}</td>
                            <td style={tdStyle}>{p.name}</td>
                            <td style={tdStyle}>{p.age}</td>
                            <td style={tdStyle}>{p.address || "-"}</td>
                            <td style={tdStyle}>
                                <button onClick={() => handleEdit(p)} style={{marginRight: "8px"}}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(p.id)} style={{color: "red"}}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
