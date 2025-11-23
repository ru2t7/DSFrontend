import axios from "axios";

// const API_BASE = "http://localhost:8080/device";
const HOST_PREFIX = process.env.REACT_APP_DEVICE_API_HOST || ""; // Gets the value from the .env files
const API_BASE = `${HOST_PREFIX}/device`; // Combines the prefix with the resource name


// Get all devices (admin sees all, users see their own)
export async function getDevices() {
    const token = localStorage.getItem("token");
    console.log(API_BASE);
    const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Create a new device
export async function createDevice(device) {
    const token = localStorage.getItem("token");
    console.log(API_BASE);
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
    // 1. Get the Authorization Token
    const token = localStorage.getItem("token"); // Assuming you stored it here after login

    // 2. Define the correct URL (using your established BASE_URL pattern)
    const BASE_URL = "http://localhost/api_device/device"; // Adjust if your BASE_URL is defined differently
    const url = `${BASE_URL}/user/${userId}/device/${deviceId}`;

    if (!token) {
        throw new Error("User is not logged in. Cannot delete.");
    }

    // 3. Send the DELETE request with the Authorization header
    await axios.delete(url, {
        headers: {
            //
            Authorization: `Bearer ${token}`
        }
    });
}
