import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL,
    timeout: 10000
});

// add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
});

// handle errors
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        const msg = err.response?.data?.error || err.message || 'Something went wrong';
        return Promise.reject(new Error(msg));
    }
);

export const auth = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password) => api.post('/auth/register', { email, password })
};

export const todos = {
    getAll: () => api.get('/todos'),
    create: (title, description) => api.post('/todos', { title, description }),
    update: (id, data) => api.put('/todos/' + id, data),
    delete: (id) => api.delete('/todos/' + id)
};

export default api;
