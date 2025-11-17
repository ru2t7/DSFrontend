import { useEffect, useState } from "react";
import { getPeople } from "../api/person-api";
import NavigationBar from "../components/NavigationBar";

export default function PeoplePage() {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        getPeople().then(setPeople);
    }, []);

    return (
        <div>
            <NavigationBar />
            <h2>People</h2>
            <ul>
                {people.map(p => (
                    <li key={p.id}>{p.username}</li>
                ))}
            </ul>
        </div>
    );
}
