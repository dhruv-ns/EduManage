import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const departmentService = {
  getAll: (params) => api.get('/departments', { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const courseService = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const attendanceService = {
  getAll: (params) => api.get('/attendance', { params }),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
};

export const resultService = {
  getAll: (params) => api.get('/results', { params }),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
  getByStudent: (studentId) => api.get(`/results/student/${studentId}`),
  publish: (data) => api.post('/results/publish', data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentAdmissions: () => api.get('/dashboard/recent-admissions'),
  getEnrollmentOverview: () => api.get('/dashboard/enrollment-overview'),
  getCourseDistribution: () => api.get('/dashboard/course-distribution'),
};

export const supportService = {
  getTickets: (params) => api.get('/support/tickets', { params }),
  createTicket: (data) => api.post('/support/tickets', data),
  updateTicket: (id, data) => api.put(`/support/tickets/${id}`, data),
};

export const settingsService = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

