import axios from 'axios';

const api = axios.create({
  baseURL: '/api/backend/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsApi = {
  getAll: (category = 'todas') => api.get(`/products.php?category=${category}`),
  getCategories: () => api.get('/products.php?categories=true'),
  add: (formData) => api.post('/products_admin.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (formData) => api.post('/products_admin.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);
    return api.post('/products_admin.php', formData);
  }
};

export const authApi = {
  login: (email, password) => api.post('/auth.php', { action: 'login', email, password }),
  register: (email, password) => api.post('/auth.php', { action: 'register', email, password }),
  logout: () => api.post('/auth.php', { action: 'logout' }),
  check: () => api.post('/auth.php', { action: 'check' }),
};

export const cartApi = {
  get: () => api.get('/cart.php'),
  add: (id, quantity) => api.post('/cart.php', { action: 'add', id, quantity }),
  remove: (id) => api.post('/cart.php', { action: 'remove', id }),
  update: (id, quantity) => api.post('/cart.php', { action: 'update', id, quantity }),
  clear: () => api.post('/cart.php', { action: 'clear' }),
};

export const checkoutApi = {
  process: (data) => api.post('/checkout.php', data),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard.php'),
  getPublicStats: () => api.get('/public_stats.php'),
};

export const usersApi = {
  getAll: () => api.get('/users.php'),
  add: (data) => api.post('/users.php', { action: 'add', ...data }),
  update: (data) => api.post('/users.php', { action: 'update', ...data }),
  delete: (id) => api.post('/users.php', { action: 'delete', id }),
};

export const transactionsApi = {
  getAll: () => api.get('/transactions.php?action=list'),
  getDetails: (id) => api.get(`/transactions.php?action=details&id=${id}`),
};

export default api;
