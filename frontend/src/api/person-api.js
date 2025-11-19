import api from "./axios";
import axios from "axios";

// Login - unchanged
export async function login(username, password) {
    const response = await axios.post("http://localhost:8081/people/login", {
        username,
        password
    });
    // extract the JWT string from the response
    return response.data; // { token: "..." }
}

// Get all people - unchanged
export async function getPeople() {
    const token = localStorage.getItem("token"); // JWT string
    const response = await axios.get("http://localhost:8081/people", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

// Get a single person by ID - unchanged
export const getPerson = async (id) =>
    (await api.get(`/people/${id}`)).data;

// Create a new person - unchanged
export const createPerson = async (person) =>
    await api.post("/people", person);

// ------------------- New functions -------------------

// Update an existing person
export const updatePerson = async (id, person) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`http://localhost:8081/people/${id}`, person, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Delete a person
export const deletePerson = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:8081/people/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export async function getPersonById(id) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8081/people/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}
