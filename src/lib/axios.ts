import axios from "axios";

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5152/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
// api.interceptors.request.use(
//     (config) => {
//         // Get the session cookie
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        }
        //return Promise.reject(error);
        return Promise.reject({
            isSuccess: false,
            code: 500,
            message: "Something went wrong",
        });
    }
);

export default api;
