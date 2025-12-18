import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Subscription endpoints
export const subscriptionApi = {
    create: (data) => api.post('/subscriptions', data),
    unsubscribe: (token) => api.delete(`/subscriptions/${token}`),
    verify: (token) => api.get(`/subscriptions/verify?token=${token}`),
};

// Outage endpoints
export const outageApi = {
    getAll: (page = 0, size = 10) => api.get(`/outages?page=${page}&size=${size}`),
    getById: (id) => api.get(`/outages/${id}`),
    getRecent: () => api.get('/outages/recent'),
    getByDistrict: (districtId, page = 0, size = 10) =>
        api.get(`/outages/by-district/${districtId}?page=${page}&size=${size}`),
    getByNeighborhood: (neighborhoodId, page = 0, size = 10) =>
        api.get(`/outages/by-neighborhood/${neighborhoodId}?page=${page}&size=${size}`),
};

// Location endpoints
export const locationApi = {
    getDistricts: () => api.get('/districts'),
    getNeighborhoods: (districtId) => api.get(`/neighborhoods?districtId=${districtId}`),
    searchNeighborhoods: (query) => api.get(`/neighborhoods/search?query=${query}`),
};

// Statistics endpoints
export const statisticsApi = {
    getStats: () => api.get('/statistics'),
};

export default api;
