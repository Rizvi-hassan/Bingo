import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_DEV_MODE === 'development' ? 'http://localhost:8080' : import.meta.env.VITE_API_URL
})

// handles oauth api request to the server
export const googleAuth = (code) => api.get(`/auth/google?code=${code}`)