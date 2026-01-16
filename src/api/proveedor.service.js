// src/api/proveedor.service.js
import axios from 'axios';
import { obtainToken } from '@/utils/obtain-token';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
});

api.interceptors.request.use((config) => {
    const token = obtainToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const ProveedorService = {
    getAll() {
        return api.get('/api/pos/proveedor');
    },
    create(data) {
        return api.post('/api/pos/proveedor', data);
    },
    update(id, data) {
        return api.put(`/api/pos/proveedor/${id}`, data);
    },
    remove(id) {
        return api.delete(`/api/pos/proveedor/${id}`);
    },
    getById(id) {
        return api.get(`/api/pos/proveedor/${id}`);
    },


};
