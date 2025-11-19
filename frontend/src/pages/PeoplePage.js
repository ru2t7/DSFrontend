import { useEffect, useState } from "react";
import { getPeople, getPersonById, createPerson, updatePerson, deletePerson } from "../api/person-api";
import NavigationBar from "../components/NavigationBar";

export default function PeoplePage() {
    const [people, setPeople] = useState([]);
    const [form, setForm] = useState({ username: "", name: "", age: "", address: "", password: "" });
    const [editingId, setEditingId] = useState(null);
    const [allAddresses, setAllAddresses] = useState([]);
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
        }
    }

    async function handleSubmit() {
        try {
            const payload = { ...form, age: Number(form.age) };
            if (!payload.password) delete payload.password;

            if (editingId) {
                await updatePerson(editingId, payload);
                setEditingId(null);
            } else {
                await createPerson(payload);
            }

            setForm({ username: "", name: "", age: "", address: "", password: "" });
            loadPeople();
        } catch (err) {
            console.error(err);
            alert("Error creating/updating person. Make sure all required fields are filled correctly.");
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
                password: ""
            });
            setEditingId(personDetails.id);
        } catch (err) {
            console.error(err);
            alert("Could not load person details.");
        }
    }

    async function handleDelete(id) {
        await deletePerson(id);
        loadPeople();
    }

    return (
        <div>
            <NavigationBar/>
            <h2>People</h2>

            <h3>{editingId ? "Edit Person" : "Add Person"}</h3>

            <input
                placeholder="Username"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
            />
            <input
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
            />
            <input
                placeholder="Age"
                type="number"
                value={form.age}
                onChange={e => setForm({...form, age: e.target.value})}
            />
            <input
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

            <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
            />

            <button onClick={handleSubmit}>{editingId ? "Update" : "Add"}</button>

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


            {/*<ul>*/}
            {/*    {people.map(p => (*/}
            {/*        <li key={p.id}>*/}
            {/*            {p.username} ({p.name}) - {p.age} - {p.address || "-"}{" "}*/}
            {/*            <button onClick={() => handleEdit(p)}>Edit</button>*/}
            {/*            <button onClick={() => handleDelete(p.id)}>Delete</button>*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    );
}
