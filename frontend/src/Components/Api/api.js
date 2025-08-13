import axios from 'axios'
axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: import.meta.env.VITE_DEV_MODE === 'dev' ? 'http://localhost:8080' : import.meta.env.VITE_API_URL
})


// handles oauth api request to the server
export const googleAuth = (code) => api.get(`/auth/google?code=${code}`, {withCredentials: true})