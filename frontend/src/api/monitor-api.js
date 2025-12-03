import axios from "axios"; // ⬅️ Use axios for consistency

// --- Configuration & Constants ---
const MONITORING_API_BASE = "http://localhost/api_monitoring/monitoring";

// SIMULATED LIST (For the device selector on the Monitoring page)
export const SIMULATED_DEVICE_LIST = [
    { id: "277386ef-3ce3-4d2b-99b2-dc9e9766c5f8", name: "Meter A (Simulator)" },
    { id: "541cb2be-6f84-49c9-afbf-481d91845343", name: "Meter B (Simulator)" },
    { id: "7b7bb7e4-f33b-4906-a016-c8b69c5b4e67", name: "Meter C (Simulator)" },
];

/**
 * Formats raw API data into a structure suitable for the Recharts library.
 */
const formatDataForChart = (data) => {
    return data.map(item => ({
        hour: new Date(item.timestamp).getHours(),
        'Consumption (kWh)': parseFloat(item.totalConsumptionKwh.toFixed(3)),
    })).sort((a, b) => a.hour - b.hour);
};


/**
 * Fetches hourly consumption data for a specific device and day (Requires Auth).
 * @param {string} deviceId - The UUID of the device.
 * @param {string} date - The date in 'YYYY-MM-DD' format.
 * @returns {Promise<Array>} A promise that resolves to the formatted consumption data.
 * @throws {Error} Throws an error if the API call fails or is unauthorized.
 */
export const fetchConsumptionData = async (deviceId, date) => {
    // 1. Get Token from localStorage (Consistent with your person-api)
    const token = localStorage.getItem("token");

    if (!token) {
        // Throw an error that MonitorPage can catch for redirection
        throw new Error("API Error 401: Token missing from localStorage.");
    }

    const url = `${MONITORING_API_BASE}/${deviceId}/daily-consumption?date=${date}`;

    console.group("📊 Monitoring API Call");
    console.log("Target URL:", url);
    console.groupEnd();

    try {
        // 2. Use Axios GET with Bearer Token in Headers
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach Token
            }
        });

        // 3. Axios handles 204 No Content transparently (response.data will be empty, 
        // but status 204 is considered success). We just check for an empty array.
        if (response.status === 204 || response.data.length === 0) {
            console.log("✅ Data Fetch Success: Status 204 (No Content)");
            return [];
        }

        console.log("✅ Data Fetch Success! Status:", response.status);

        return formatDataForChart(response.data);// { token: "..." }

    } catch (error) {
        // 4. Use the same robust error logging structure as your login function
        console.group("❌ Monitoring API Failed");

        if (error.response) {
            console.error("Server Status:", error.response.status);
            console.error("Server Message:", error.response.data);

            // Re-throw specific 401/403 errors for MonitorPage to handle redirection
            if (error.response.status === 401 || error.response.status === 403) {
                throw new Error(`API Error ${error.response.status}: ${error.response.statusText}`);
            }
        } else if (error.request) {
            console.error("No response received! (Network/CORS Error)");
        } else {
            console.error("Error Message:", error.message);
        }
        console.groupEnd();

        // Re-throw the error for the calling component (MonitorPage)
        throw error;
    }
};
