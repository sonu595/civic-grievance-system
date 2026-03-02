import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // .env में डाल सकते हो बाद में
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - common error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // तुम चाहो तो यहाँ global toast error दिखा सकते हो
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;