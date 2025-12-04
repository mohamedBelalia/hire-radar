
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});


console.log('API Client base URL:', apiClient.defaults.baseURL);

export default apiClient;