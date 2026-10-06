import axios from "axios";

const searchApi = axios.create({
    baseURL: `https://api.mapbox.com/search/searchbox/v1`,
    params: {
        session_token: import.meta.env.VITE_SESSION_TOKEN,
        language: 'es',
        access_token: import.meta.env.VITE_ACCESS_TOKEN
    }
});

export default searchApi;