import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== Auth & Users ==========
export const authAPI = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  getMe: () => api.get('/me'),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getDeleted: () => api.get('/users/deleted'),
  restore: (id) => api.patch(`/users/${id}/restore`),
  forceDelete: (id) => api.delete(`/users/${id}/force`),
};

// ========== Products ==========
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/category/${categoryId}/products`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/products', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/products/${id}`, data);
  },
  uploadImage: (id, formData) => api.post(`/products/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  getDeleted: () => api.get('/products/deleted'),
  restore: (id) => api.patch(`/products/${id}/restore`),
  forceDelete: (id) => api.delete(`/products/${id}/force`),
  getVariants: (id) => api.get(`/products/${id}/variants`),
  upsertVariants: (id, variants) => api.put(`/products/${id}/variants`, { variants }),
};

// ========== Categories ==========
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/categories', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/categories/${id}`, data);
  },
  delete: (id) => api.delete(`/categories/${id}`),
  getDeleted: () => api.get('/categories/deleted'),
  restore: (id) => api.patch(`/categories/${id}/restore`),
  forceDelete: (id) => api.delete(`/categories/${id}/force`),
};

// ========== Orders ==========
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getAllOrders: () => api.get('/orders/all'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getDeleted: () => api.get('/orders/deleted'),
  restore: (id) => api.patch(`/orders/${id}/restore`),
  forceDelete: (id) => api.delete(`/orders/${id}/force`),
  getRevenue: () => api.get('/revenue'),
};

// ========== Site Settings ==========
export const settingAPI = {
  getAll: () => api.get('/settings'),
  getList: () => api.get('/settings/list'),
  getByKey: (key) => api.get(`/settings/${key}`),
  upsert: (data) => api.post('/settings', data),
  bulkUpsert: (settings) => api.put('/settings/bulk', { settings }),
  delete: (key) => api.delete(`/settings/${key}`),
};

export default api;
