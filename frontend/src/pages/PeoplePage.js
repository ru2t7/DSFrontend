import { useEffect, useState } from "react";
import { getPeople, getPersonById, createPerson, updatePerson, deletePerson } from "../api/person-api";
import NavigationBar from "../components/NavigationBar";

// 🎨 Define general styles
const generalStyles = {
    container: {
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9"
    },
    formBox: {
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        marginBottom: "30px"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        backgroundColor: "white"
    },
    th: {
        padding: "15px",
        borderBottom: "3px solid #007bff",
        textAlign: "left",
        backgroundColor: "#eaf5ff",
        fontWeight: "bold",
        color: "#333"
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #eee",
        verticalAlign: "middle"
    },
    input: {
        margin: "8px 10px 8px 0", // More space between inputs
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc" ,
        minWidth: '150px' // Ensure minimum size
    }
};

export default function PeoplePage() {
    const [people, setPeople] = useState([]);
    const [allAddresses, setAllAddresses] = useState([]);
    const [form, setForm] = useState({
        username: "",
        name: "",
        age: "",
        address: "",
        password: "",
        role: "USER" // Default role
    });
    const [editingId, setEditingId] = useState(null);

    // Apply specific styles for headers and cells
    const thStyle = generalStyles.th;
    const tdStyle = generalStyles.td;
    const inputStyle = generalStyles.input;

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
        setForm({ username: "", name: "", age: "", address: "", password: "", role: "USER" });
        setEditingId(null);
    }

    async function handleSubmit() {
        try {
            // Ensure age is a number and password is deleted if empty on update
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
                const msg = err.response.data.message || (err.response.data.title ? err.response.data.title : "Operation failed");
                alert(`Error: ${msg}`);
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
                role: personDetails.role || "USER" // Ensure role is preserved for editing
            });
            setEditingId(personDetails.id);
        } catch (err) {
            console.error(err);
            alert("Could not load person details.");
        }
    }

    async function handleDelete(id) {
        if(!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deletePerson(id);
            loadPeople();
        } catch (err) {
            console.error(err);
            alert("Failed to delete user.");
        }
    }

    // Helper to render role badge
    const RoleBadge = ({ role }) => {
        const isAdmin = role === 'ADMIN';
        const badgeStyle = {
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "0.85em",
            fontWeight: "bold",
            backgroundColor: isAdmin ? '#d4edda' : '#cce5ff', // Light green/blue
            color: isAdmin ? '#155724' : '#004085'           // Dark green/blue text
        };
        return <span style={badgeStyle}>{role || "USER"}</span>;
    };


    return (
        <div>
            <NavigationBar/>
            <div style={generalStyles.container}>
                <h1 style={{color: '#333', marginBottom: '20px'}}>User Management</h1>

                <div style={generalStyles.formBox}>
                    <h3>{editingId ? "Edit Person" : "Add New Person"}</h3>

                    <input
                        style={inputStyle}
                        placeholder="Username"
                        value={form.username}
                        onChange={e => setForm({...form, username: e.target.value})}
                        disabled={!!editingId} // Disable username edit
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

                    <div style={{marginTop: "15px"}}>
                        <button onClick={handleSubmit} style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginRight: "10px",
                            fontWeight: "bold"
                        }}>
                            {editingId ? "Update User" : "Add User"}
                        </button>

                        {editingId && (
                            <button onClick={resetForm} style={{
                                padding: "10px 20px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
                <table style={generalStyles.table}>
                    <thead>
                    <tr style={{borderBottom: "1px solid #ccc"}}>
                        <th style={thStyle}>Username</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Age</th>
                        <th style={thStyle}>Address</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {people.map(p => (
                        <tr key={p.id}>
                            <td style={tdStyle}>{p.username}</td>
                            <td style={tdStyle}>{p.name}</td>
                            <td style={tdStyle}><RoleBadge role={p.role} /></td> {/* ✅ Display Badge */}
                            <td style={tdStyle}>{p.age}</td>
                            <td style={tdStyle}>{p.address || "-"}</td>
                            <td style={tdStyle}>
                                <button onClick={() => handleEdit(p)} style={{marginRight: "8px", padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer"}}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(p.id)} style={{color: "white", backgroundColor: "#dc3545", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer"}}>
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
