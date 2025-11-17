import axios from "axios";

const API_BASE = "http://localhost:8080/device";

export async function getDevices() {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export async function createDevice(device) {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_BASE, device, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export async function getDeviceById(id) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}
