import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080'
})

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`)