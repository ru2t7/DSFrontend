import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchConsumptionData, SIMULATED_DEVICE_LIST } from "../api/monitor-api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

// --- Styling Constants (Copied from DevicesPage) ---
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
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center"
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
    h1: {
        color: '#333',
        marginBottom: '20px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px'
    }
};
// ----------------------------------------------------

export default function MonitorPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDevice, setSelectedDevice] = useState(SIMULATED_DEVICE_LIST[0].id);
    const [consumptionData, setConsumptionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hooks from your original structure
    const { isAuthenticated, setToken } = useContext(AuthContext); // Get setToken for logout handling
    const navigate = useNavigate();

    // 1. Authentication/Authorization Check (Similar to DevicesPage/PeoplePage)
    useEffect(() => {
        // If we are not authenticated, attempt to redirect to login.
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        setConsumptionData([]);

        try {
            // Token is retrieved internally by monitor-api.js from localStorage
            const data = await fetchConsumptionData(selectedDevice, selectedDate);
            setConsumptionData(data);
        } catch (err) {
            console.error("Data loading failed", err);

            // Handle HTTP 401 Unauthorized (Token is invalid/expired)
            if (err.message.includes("API Error 401")) {
                alert("Session expired. Please log in again.");
                setToken(null); // Clear context token
                localStorage.removeItem("token");
                navigate('/login'); // Redirect
            }
            // Handle other errors (403 Forbidden, 404, Network)
            else {
                // Show the specific error message generated in monitor-api.js
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Load data automatically on selection change (Only if authenticated)
    useEffect(() => {
        if (selectedDate && selectedDevice && isAuthenticated) {
            loadData();
        }
    }, [selectedDate, selectedDevice, isAuthenticated]);

    // Do not render the page content if the user is not authenticated (will be handled by useEffect redirect)
    if (!isAuthenticated) return <NavigationBar />;

    const currentDeviceName = SIMULATED_DEVICE_LIST.find(d => d.id === selectedDevice)?.name || "Unknown Device";

    return (
        <div>
            <NavigationBar />
            <div style={generalStyles.container}>
                <h1 style={generalStyles.h1}>Energy Consumption Visualization</h1>

                {/* Control Panel (Styled to resemble generalStyles.formBox) */}
                <div style={generalStyles.formBox}>
                    <h3 style={{width: '100%', marginBottom: '15px'}}>Select Parameters</h3>

                    {/* Device Selector */}
                    <label style={{marginRight: '10px'}}>Device:</label>
                    <select
                        style={generalStyles.input}
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                    >
                        {SIMULATED_DEVICE_LIST.map(device => (
                            <option key={device.id} value={device.id}>
                                {device.name}
                            </option>
                        ))}
                    </select>

                    {/* Date Picker */}
                    <label style={{marginRight: '10px', marginLeft: '20px'}}>Date:</label>
                    <input
                        style={generalStyles.input}
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />

                    <div style={{ marginLeft: 'auto' }}>
                        <button onClick={loadData} style={generalStyles.buttonPrimary} disabled={loading}>
                            {loading ? 'Loading...' : 'Show Data'}
                        </button>
                    </div>
                </div>

                {/* Error/Loading Feedback */}
                {loading && <div style={{padding: '15px', color: '#007bff'}}>Loading aggregated data...</div>}
                {error && <div style={{padding: '15px', color: '#dc3545', backgroundColor: '#f8d7da', borderRadius: '5px'}}>Error: {error}</div>}

                {/* Chart Visualization */}
                {!loading && !error && consumptionData.length > 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '25px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h3 style={{marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>
                            Hourly Consumption for {currentDeviceName} on {selectedDate}
                        </h3>
                        {/* Recharts requires a container with fixed dimensions */}
                        <div style={{ width: '100%', height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={consumptionData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" label={{ value: 'Hour of Day (OX Axis)', position: 'bottom' }}/>
                                    <YAxis label={{ value: 'Energy (kWh) (OY Axis)', angle: -90, position: 'left' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Consumption (kWh)" fill="#007bff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    !loading && !error && (
                        <div style={{padding: '15px', color: '#6c757d', backgroundColor: '#f0f0f0', borderRadius: '5px'}}>
                            No data available for the selected device or day.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
