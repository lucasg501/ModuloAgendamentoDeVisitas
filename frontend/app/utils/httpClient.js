'use client'
import cookie from 'cookie'
const baseUrl = "http://localhost:4000";

let chaveApi = "";
if(typeof document != 'undefined') {
    let cookies = cookie.parse(document.cookie)
    if(cookies.cookieAuth != undefined) {
        chaveApi = cookies.cookieAuth;
    }
}


const httpClient = {

    get: (endpoint) => {
        let config = {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'chaveapi': chaveApi
            }
        }

        endpoint = baseUrl + endpoint;
        return fetch(endpoint, config);
    },
    post: (endpoint, body) => {
        let config = {
            credentials: 'include',
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'chaveapi': chaveApi
            },
            body: JSON.stringify(body)
        }

        endpoint = baseUrl + endpoint;
        return fetch(endpoint, config);
    },
    delete: (endpoint) => {
        let config = {
            credentials: 'include',
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'chaveapi': chaveApi
            }
        }

        endpoint = baseUrl + endpoint;
        return fetch(endpoint, config);
    },
    put: (endpoint, body) => {
        let config = {
            credentials: 'include',
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'chaveapi': chaveApi
            },
            body: JSON.stringify(body)
        }
        endpoint = baseUrl + endpoint;
        return fetch(endpoint, config)
    }
}

export default httpClient;