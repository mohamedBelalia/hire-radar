import axios from 'axios'
const SERVER_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_SERVER

export const expressServer = axios.create({
    baseURL: SERVER_BASE_URL,
    withCredentials: true
})