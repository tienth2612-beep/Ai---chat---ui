import axios from "axios";

// var baseUrl =
//     process.env.NEXT_PUBLIC_API_URL ||
//     "https://hitradies-backoffice-api-9zcxn.ondigitalocean.app/api/";
const baseUrl = "https://api-backoffice.hitradies.com/api";
// Create axios instance with default config
const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const apiFormBuilder = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
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
