import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://localhost:3001'
});

Api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, err => Promise.reject(err));

export default Api;