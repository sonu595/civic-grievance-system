import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request Interceptor: Token automatically attach karne ke liye
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Authentication APIs
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Complaint APIs
export const fileComplaint = (formData) => API.post('/complaints', formData);
export const getMyComplaints = () => API.get('/complaints/user');
export const getSingleComplaint = (id) => API.get(`/complaints/${id}`);

// Department & Profile
export const getDepartments = () => API.get('/departments');
export const getProfile = () => API.get('/users/profile');