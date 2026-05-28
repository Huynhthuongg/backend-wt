import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auto attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token khi hết hạn
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
        localStorage.setItem('token', data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/api/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
};

// Media
export const mediaAPI = {
  getAll: (params) => api.get('/api/media', { params }),
  getById: (id) => api.get(`/api/media/${id}`),
  upload: (formData) => api.post('/api/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  bulkUpload: (formData) => api.post('/api/v2/media/bulk', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/api/media/${id}`),
  getAnalytics: () => api.get('/api/v2/media/analytics'),
};

// Content
export const contentAPI = {
  getAll: (params) => api.get('/api/content', { params }),
  getBySlug: (slug) => api.get(`/api/content/${slug}`),
  create: (data) => api.post('/api/content', data),
  update: (id, data) => api.put(`/api/content/${id}`, data),
  delete: (id) => api.delete(`/api/content/${id}`),
  search: (params) => api.get('/api/v2/content/search', { params }),
  bulkPublish: (ids) => api.patch('/api/v2/content/bulk-publish', { ids }),
};

// Comments
export const commentAPI = {
  getAll: (targetType, targetId, params) => api.get(`/api/comments/${targetType}/${targetId}`, { params }),
  create: (data) => api.post('/api/comments', data),
  update: (id, content) => api.put(`/api/comments/${id}`, { content }),
  delete: (id) => api.delete(`/api/comments/${id}`),
  like: (id) => api.post(`/api/comments/${id}/like`),
};

// Reactions
export const reactionAPI = {
  get: (targetType, targetId) => api.get(`/api/reactions/${targetType}/${targetId}`),
  toggle: (data) => api.post('/api/reactions', data),
};

// Notifications
export const notificationAPI = {
  getAll: (params) => api.get('/api/notifications', { params }),
  markAsRead: (ids) => api.patch('/api/notifications/read', { ids }),
  delete: (id) => api.delete(`/api/notifications/${id}`),
};

// Categories
export const categoryAPI = {
  getAll: () => api.get('/api/categories'),
  getBySlug: (slug) => api.get(`/api/categories/${slug}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// User
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updateAvatar: (formData) => api.put('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePassword: (data) => api.put('/user/password', data),
  getMyMedia: () => api.get('/user/my-media'),
  getMyContent: () => api.get('/user/my-content'),
};

// Vendor
export const vendorAPI = {
  getAll: (params) => api.get('/vendor', { params }),
  getById: (id) => api.get(`/vendor/${id}`),
  create: (data) => api.post('/vendor', data),
  updateStatus: (id, status) => api.put(`/vendor/${id}/status`, { status }),
};

// Platform Admin
export const platAPI = {
  getDashboard: () => api.get('/plat/dashboard'),
  getUsers: (params) => api.get('/plat/users', { params }),
  updateUserRole: (id, role) => api.put(`/plat/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/plat/users/${id}/toggle`),
};

export default api;
