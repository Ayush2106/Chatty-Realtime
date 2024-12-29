import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:8080/api" : "/api",
    withCredentials:true, // use to send cookie in each request 
})