import api from "./axios";
import axios from "axios";

// const HOST_PREFIX = process.env.REACT_APP_PERSON_API_HOST || "";
// const API_BASE = `${HOST_PREFIX}/people`;

export const API_BASE = "http://localhost/api_person/people";

console.log("🚀 VERSION_TEST_100: Reading from Absolute Path!");

// Login - unchanged
export async function login(username, password) {
    const url = `${API_BASE}/login`;

    // 1. Log the Request Details (Masking the password for safety)
    console.group("🔑 Login Attempt");
    console.log("Target URL:", url);
    console.log("Username:", username);
    console.groupEnd();

    try {
        const response = await axios.post(url, {
            username,
            password
        });

        // 2. Log Success
        console.log("✅ Login Success! Status:", response.status);
        console.log("Response Data:", response.data);

        return response.data; // { token: "..." }

    } catch (error) {
        // 3. Log Failure Details
        console.group("❌ Login Failed");

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server Status:", error.response.status);
            console.error("Server Message:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // This usually means Network Error, CORS, or Docker/Traefik misconfiguration
            console.error("No response received! (Network/CORS Error)");
            console.error("Request object:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error Message:", error.message);
        }
        console.groupEnd();

        // Re-throw the error so your React Component (LoginPage.js) can show the alert
        throw error;
    }
}

// Get all people - unchanged
export async function getPeople() {
    const token = localStorage.getItem("token"); // JWT string
    const response = await axios.get(API_BASE, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

// Get a single person by ID - unchanged
export const getPerson = async (id) =>
    (await api.get(`${API_BASE}/${id}`)).data;

// Create a new person - unchanged
export const createPerson = async (person) =>
    await api.post(API_BASE, person);

// ------------------- New functions -------------------

// Update an existing person
export const updatePerson = async (id, person) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE}/${id}`, person, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Delete a person
export const deletePerson = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export async function getPersonById(id) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}
