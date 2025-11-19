import { useEffect, useState } from "react";
import { getAssignments, assignDeviceToUser, removeDeviceFromUser } from "../api/device-api";
import { getDevices } from "../api/device-api";
import { getPeople } from "../api/person-api";
import NavigationBar from "../components/NavigationBar";

export default function DeviceAssignmentPage() {
    const [assignments, setAssignments] = useState([]);
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    const thStyle = { padding: "8px", borderBottom: "2px solid #ccc", textAlign: "left" };
    const tdStyle = { padding: "8px" };

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
            setSelectedDevice("");
            setSelectedUser("");
            loadAssignments();
        } catch (err) {
            console.error(err);
            alert("Failed to assign device");
        }
    }

    async function handleRemove(deviceId, userId) {
        try {
            await removeDeviceFromUser(deviceId, userId);
            loadAssignments();
        } catch (err) {
            console.error(err);
            alert("Failed to remove device");
        }
    }

    return (
        <div>
            <NavigationBar />
            <h2>Assign Devices to Users</h2>

            <div style={{ marginBottom: "20px" }}>
                <select value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)}>
                    <option value="">Select Device</option>
                    {devices.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.max_consumption})</option>
                    ))}
                </select>

                <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{ marginLeft: "10px" }}>
                    <option value="">Select User</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.username} ({u.name})</option>
                    ))}
                </select>

                <button onClick={handleAssign} style={{ marginLeft: "10px" }}>Assign</button>
            </div>

            <h3>Assigned Devices</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                <tr style={{ background: "#f0f0f0" }}>
                    <th style={thStyle}>Device</th>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {assignments.map(a => (
                    <tr key={`${a.deviceId}-${a.userId}`} style={{ borderBottom: "1px solid #ccc" }}>
                        <td style={tdStyle}>{a.deviceName}</td>
                        <td style={tdStyle}>{a.username} ({a.name})</td>
                        <td style={tdStyle}>
                            <button style={{ color: "red" }} onClick={() => handleRemove(a.deviceId, a.userId)}>Remove</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
