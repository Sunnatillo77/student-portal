import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API методы
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.put('/profile/me', data),
};

export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getMy: () => api.get('/courses/my'),
  create: (data) => api.post('/courses', data),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
};

export const assignmentsAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  getMy: () => api.get('/assignments/my'),
  create: (data) => api.post('/assignments', data),
  submit: (id, data) => api.post(`/assignments/${id}/submit`, data),
  grade: (submissionId, data) => api.post(`/assignments/submissions/${submissionId}/grade`, data),
};

export const scheduleAPI = {
  getAll: (params) => api.get('/schedule', { params }),
  getById: (id) => api.get(`/schedule/${id}`),
  create: (data) => api.post('/schedule', data),
  update: (id, data) => api.put(`/schedule/${id}`, data),
  delete: (id) => api.delete(`/schedule/${id}`),
};

export const materialsAPI = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
};

export const gradesAPI = {
  getAll: (params) => api.get('/grades', { params }),
  getById: (id) => api.get(`/grades/${id}`),
  getPerformance: (studentId) => api.get(`/grades/performance${studentId ? `/${studentId}` : ''}`),
};

export default api;


