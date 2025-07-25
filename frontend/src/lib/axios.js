import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_DEV_MODE === 'dev' ? "http://localhost:8080" : import.meta.env.VITE_API_URL ,
    withCredentials: true
})