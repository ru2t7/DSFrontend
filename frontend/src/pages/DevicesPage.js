import { useEffect, useState, useContext } from "react";
import { getDevices } from "../api/device-api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

export default function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const { setToken } = useContext(AuthContext); // still here if needed elsewhere
    const navigate = useNavigate();               // still here if needed elsewhere

    useEffect(() => {
        getDevices().then(setDevices).catch(err => console.error(err));
    }, []);

    return (
        <div>
            <NavigationBar />
            <h2>My Devices</h2>
            <ul>
                {devices.map(d => (
                    <li key={d.id}>
                        {d.name} - {d.type} {/* customize fields as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
}
