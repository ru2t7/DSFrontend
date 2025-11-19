import { useEffect, useState, useContext } from "react";
import { getDevices, getDeviceById, createDevice, updateDevice, deleteDevice } from "../api/device-api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

export default function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const [form, setForm] = useState({ name: "", max_consumption: "" });
    const [editingId, setEditingId] = useState(null);

    const { setToken } = useContext(AuthContext); // keep if needed elsewhere
    const navigate = useNavigate();               // keep if needed elsewhere

    // Table cell styling
    const thStyle = { padding: "8px", borderBottom: "2px solid #ccc", textAlign: "left" };
    const tdStyle = { padding: "8px" };

    // Load all devices
    useEffect(() => {
        loadDevices();
    }, []);

    async function loadDevices() {
        try {
            const data = await getDevices();
            setDevices(data);
        } catch (err) {
            console.error("Failed to load devices", err);
        }
    }

    // Add or update a device
    async function handleSubmit() {
        try {
            const payload = { ...form, max_consumption: Number(form.max_consumption) };

            if (editingId) {
                await updateDevice(editingId, payload);
                setEditingId(null);
            } else {
                await createDevice(payload);
            }

            setForm({ name: "", max_consumption: "" });
            loadDevices();
        } catch (err) {
            console.error(err);
            alert("Error creating/updating device. Make sure all fields are valid.");
        }
    }

    // Load device for editing
    async function handleEdit(device) {
        try {
            const deviceDetails = await getDeviceById(device.id);
            setForm({
                name: deviceDetails.name,
                max_consumption: deviceDetails.max_consumption
            });
            setEditingId(deviceDetails.id);
        } catch (err) {
            console.error(err);
            alert("Could not load device details.");
        }
    }

    // Delete a device
    async function handleDelete(id) {
        try {
            await deleteDevice(id);
            loadDevices();
        } catch (err) {
            console.error(err);
            alert("Failed to delete device.");
        }
    }

    return (
        <div>
            <NavigationBar />
            <h2>Devices</h2>

            <h3>{editingId ? "Edit Device" : "Add Device"}</h3>
            <input
                placeholder="Device Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
                placeholder="Max Consumption"
                type="number"
                value={form.max_consumption}
                onChange={e => setForm({ ...form, max_consumption: e.target.value })}
            />
            <button onClick={handleSubmit}>{editingId ? "Update" : "Add"}</button>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                <tr style={{ background: "#f0f0f0" }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Max Consumption</th>
                    <th style={thStyle}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {devices.map(d => (
                    <tr key={d.id} style={{ borderBottom: "1px solid #ccc" }}>
                        <td style={tdStyle}>{d.name}</td>
                        <td style={tdStyle}>{d.max_consumption}</td>
                        <td style={tdStyle}>
                            <button onClick={() => handleEdit(d)} style={{ marginRight: "8px" }}>Edit</button>
                            <button onClick={() => handleDelete(d.id)} style={{ color: "red" }}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}




// import { useEffect, useState, useContext } from "react";
// import { getDevices } from "../api/device-api";
// import { AuthContext } from "../auth/AuthContext";
// import { useNavigate } from "react-router-dom";
// import NavigationBar from "../components/NavigationBar";
//
// export default function DevicesPage() {
//     const [devices, setDevices] = useState([]);
//     const { setToken } = useContext(AuthContext); // still here if needed elsewhere
//     const navigate = useNavigate();               // still here if needed elsewhere
//
//     useEffect(() => {
//         getDevices().then(setDevices).catch(err => console.error(err));
//     }, []);
//
//     return (
//         <div>
//             <NavigationBar />
//             <h2>My Devices</h2>
//             <ul>
//                 {devices.map(d => (
//                     <li key={d.id}>
//                         {d.name} - {d.type} {/* customize fields as needed */}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
