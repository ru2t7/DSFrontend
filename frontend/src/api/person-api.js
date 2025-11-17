import api from "./axios";

import axios from "axios";

export async function login(username, password) {
    const response = await axios.post("http://localhost:8081/people/login", {
        username,
        password
    });
    // extract the JWT string from the response
    return response.data; // { token: "..." }
}


export async function getPeople() {
    const token = localStorage.getItem("token"); // JWT string
    const response = await axios.get("http://localhost:8081/people", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const getPerson = async (id) =>
    (await api.get(`/people/${id}`)).data;

export const createPerson = async (person) =>
    await api.post("/people", person);



// import {HOST} from '../../commons/hosts';
// import RestApiClient from "../../commons/api/rest-client";
//
//
// const endpoint = {
//     person: '/people' //CHANGED
// };
//
// function getPersons(callback) {
//     let request = new Request(HOST.backend_api + endpoint.person, {
//         method: 'GET',
//     });
//     console.log(request.url);
//     RestApiClient.performRequest(request, callback);
// }
//
// function getPersonById(params, callback){
//     let request = new Request(HOST.backend_api + endpoint.person + params.id, {
//        method: 'GET'
//     });
//
//     console.log(request.url);
//     RestApiClient.performRequest(request, callback);
// }
//
// function postPerson(user, callback){
//     let request = new Request(HOST.backend_api + endpoint.person , {
//         method: 'POST',
//         headers : {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user)
//     });
//
//     console.log("URL: " + request.url);
//
//     RestApiClient.performRequest(request, callback);
// }
//
// export {
//     getPersons,
//     getPersonById,
//     postPerson
// };
