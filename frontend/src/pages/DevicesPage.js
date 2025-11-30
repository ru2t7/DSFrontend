import { useEffect, useState, useContext } from "react";
import { getDevices, getDeviceById, createDevice, updateDevice, deleteDevice } from "../api/device-api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

// 🎨 Define general styles, consistent with PeoplePage
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
        marginBottom: "30px",
        display: "flex", // Use flex for easy input layout
        flexWrap: "wrap", // Allow wrapping on small screens
        alignItems: "center"
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
        margin: "8px 10px 8px 0",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        minWidth: '150px'
    },
    buttonPrimary: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "10px",
        fontWeight: "bold"
    },
    buttonSecondary: {
        padding: "10px 20px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const [form, setForm] = useState({ name: "", max_consumption: "" });
    const [editingId, setEditingId] = useState(null);

    // Style variables
    const thStyle = generalStyles.th;
    const tdStyle = generalStyles.td;
    const inputStyle = generalStyles.input;
    const { setToken } = useContext(AuthContext); // Keep if needed elsewhere
    const navigate = useNavigate();               // Keep if needed elsewhere

    useEffect(() => {
        loadDevices();
    }, []);

    async function loadDevices() {
        try {
            const data = await getDevices();
            setDevices(data);
        } catch (err) {
            console.error("Failed to load devices", err);
            if(err.response && err.response.status === 401) {
                alert("You are not authorized. Please login.");
            }
        }
    }

    // Function to reset form state
    function resetForm() {
        setForm({ name: "", max_consumption: "" });
        setEditingId(null);
    }

    // Add or update a device
    async function handleSubmit() {
        try {
            const payload = { ...form, max_consumption: Number(form.max_consumption) };

            if (editingId) {
                await updateDevice(editingId, payload);
                alert("Device updated successfully!");
            } else {
                await createDevice(payload);
                alert("Device created successfully!");
            }

            resetForm();
            loadDevices();
        } catch (err) {
            console.error(err);
            // Provide better error feedback
            alert(`Error creating/updating device: ${err.response?.data?.message || 'Check input fields.'}`);
        }
    }

    // Load device for editing
    async function handleEdit(device) {
        try {
            // Note: device passed here might be DTO, fetch full details
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
        if(!window.confirm("Are you sure you want to delete this device and all its assignments?")) return;
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
            <div style={generalStyles.container}>
                <h1 style={{color: '#333', marginBottom: '20px'}}>Device Inventory</h1>

                <div style={generalStyles.formBox}>
                    <h3 style={{width: '100%', marginBottom: '15px'}}>{editingId ? "Edit Device" : "Add New Device"}</h3>

                    <input
                        style={inputStyle}
                        placeholder="Device Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        style={inputStyle}
                        placeholder="Max Consumption (Wh)"
                        type="number"
                        value={form.max_consumption}
                        onChange={e => setForm({ ...form, max_consumption: e.target.value })}
                        required
                    />

                    <div style={{ marginTop: "10px", marginLeft: '10px' }}>
                        <button onClick={handleSubmit} style={generalStyles.buttonPrimary}>
                            {editingId ? "Update Device" : "Add Device"}
                        </button>

                        {editingId && (
                            <button onClick={resetForm} style={generalStyles.buttonSecondary}>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <table style={generalStyles.table}>
                    <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Max Consumption (Wh)</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {devices.map(d => (
                        <tr key={d.id}>
                            <td style={tdStyle}>{d.name}</td>
                            {/* Assuming max_consumption is the field name */}
                            <td style={tdStyle}>{d.max_consumption}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => handleEdit(d)}
                                    style={{ marginRight: "8px", padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(d.id)}
                                    style={{color: "white", backgroundColor: "#dc3545", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer"}}
                                >
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
