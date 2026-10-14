import axios from "axios";

const searchApi = axios.create({
    baseURL: `https://api.mapbox.com/search/searchbox/v1`,
    params: {
        session_token: process.env.REACT_APP_SESSION_TOKEN,
        language: 'es',
        access_token:  process.env.REACT_APP_ACCESS_TOKEN,
    }
});

export default searchApi;