import axios from "axios";

const API = axios.create({
    baseURL: "http://26.***.**.**:8000",
});

// Перехватчик для добавления токена в заголовок Authorization
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
