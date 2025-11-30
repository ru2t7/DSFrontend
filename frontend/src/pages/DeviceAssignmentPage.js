import { useEffect, useState } from "react";
import { getAssignments, assignDeviceToUser, removeDeviceFromUser } from "../api/device-api";
import { getDevices } from "../api/device-api";
import { getPeople } from "../api/person-api";
import NavigationBar from "../components/NavigationBar";

// 🎨 Define general styles, consistent with other pages
const generalStyles = {
    container: {
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9"
    },
    controlBox: {
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center"
    },
    select: {
        padding: "10px",
        marginRight: "15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        minWidth: "200px"
    },
    buttonPrimary: {
        padding: "10px 20px",
        backgroundColor: "#28a745", // Green for Assignment
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
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
    buttonDanger: {
        padding: "6px 12px",
        color: "white",
        backgroundColor: "#dc3545", // Red for Remove
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    }
};

export default function DeviceAssignmentPage() {
    const [assignments, setAssignments] = useState([]);
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    const thStyle = generalStyles.th;
    const tdStyle = generalStyles.td;

    useEffect(() => {
        loadDevices();
        loadUsers();
        loadAssignments();
    }, []);

    async function loadDevices() {
        try {
            const data = await getDevices();
            setDevices(data);
        } catch (err) {
            console.error("Failed to load devices", err);
            if (err.response && err.response.status === 401) alert("Not authorized to load devices.");
        }
    }

    async function loadUsers() {
        try {
            const data = await getPeople();
            setUsers(data);
        } catch (err) {
            console.error("Failed to load users", err);
        }
    }

    async function loadAssignments() {
        try {
            const data = await getAssignments();
            setAssignments(data);
        } catch (err) {
            console.error("Failed to load assignments", err);
        }
    }

    async function handleAssign() {
        if (!selectedDevice || !selectedUser) {
            alert("Please select both device and user");
            return;
        }
        try {
            await assignDeviceToUser(selectedDevice, selectedUser);
            alert("Device assigned successfully!");
            setSelectedDevice("");
            setSelectedUser("");
            loadAssignments();
        } catch (err) {
            console.error(err);
            // Provide specific feedback if possible (e.g., if already assigned)
            alert(`Failed to assign device: ${err.response?.data?.message || 'Check network/permissions.'}`);
        }
    }

    async function handleRemove(deviceId, userId) {
        if(!window.confirm("Are you sure you want to remove this assignment?")) return;
        try {
            await removeDeviceFromUser(deviceId, userId);
            alert("Assignment removed successfully!");
            loadAssignments();
        } catch (err) {
            console.error(err);
            alert(`Failed to remove device: ${err.response?.data?.message || 'Check network/permissions.'}`);
        }
    }

    return (
        <div>
            <NavigationBar />
            <div style={generalStyles.container}>
                <h1 style={{color: '#333', marginBottom: '20px'}}>Device Assignment</h1>

                <div style={generalStyles.controlBox}>
                    <select
                        value={selectedDevice}
                        onChange={e => setSelectedDevice(e.target.value)}
                        style={generalStyles.select}
                    >
                        <option value="">Select Device</option>
                        {devices.map(d => (
                            <option key={d.id} value={d.id}>{d.name} (Max: {d.max_consumption} Wh)</option>
                        ))}
                    </select>

                    <select
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        style={generalStyles.select}
                    >
                        <option value="">Select User</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username} ({u.name})</option>
                        ))}
                    </select>

                    <button onClick={handleAssign} style={generalStyles.buttonPrimary}>
                        Assign Device
                    </button>
                </div>

                <h3 style={{marginBottom: '15px'}}>Current Assignments</h3>
                <table style={generalStyles.table}>
                    <thead>
                    <tr>
                        <th style={thStyle}>Device</th>
                        <th style={thStyle}>User</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {assignments.map(a => (
                        <tr key={`${a.deviceId}-${a.userId}`}>
                            <td style={tdStyle}>
                                <strong>{a.deviceName}</strong> (Consumption: {a.deviceMaxConsumption} Wh)
                            </td>
                            <td style={tdStyle}>{a.username} ({a.name})</td>
                            <td style={tdStyle}>
                                <button
                                    style={generalStyles.buttonDanger}
                                    onClick={() => handleRemove(a.deviceId, a.userId)}
                                >
                                    Remove Assignment
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
