import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// Response interceptor for error handling
api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ==================== PRODUCTS ====================
export const productApi = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) => api.post('/products', formData),
  update: (id, formData) => api.put(`/products/${id}`, formData),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, data) => api.patch(`/products/${id}/stock`, data),
  getLowStock: () => api.get('/products/low-stock'),
  getDashboardStats: () => api.get('/products/stats/dashboard'),
}

export default api
