import axios from "axios";

const API_BASE = "http://localhost:8080/device";

// Get all devices (admin sees all, users see their own)
export async function getDevices() {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Create a new device
export async function createDevice(device) {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_BASE, device, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Get a single device by ID
export async function getDeviceById(id) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Update an existing device
export async function updateDevice(id, device) {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE}/${id}`, device, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Delete a device
export async function deleteDevice(id) {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function assignDeviceToUser(deviceId, userId) {
    const token = localStorage.getItem("token");
    return fetch(`${API_BASE}/${deviceId}/assign/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });}

// Get all device assignments (for admin assignment page)
export async function getAssignments() {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export async function removeDeviceFromUser(deviceId, userId) {
    return fetch(`/device/user/${userId}/device/${deviceId}`, { method: "DELETE" });
}
