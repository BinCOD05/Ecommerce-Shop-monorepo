import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userInfo');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(err.response?.data ?? err);
  }
);

export default api;
