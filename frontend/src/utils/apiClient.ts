// frontend/src/utils/apiClient.ts

import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { BACKEND_URL } from '../config';
const API_BASE_URL = BACKEND_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      if (!config.headers) {
        config.headers = {}; // Initialize headers if they are undefined
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.error(
        'Authentication error: Token might be invalid or expired. Attempting logout and redirect to login.'
      );
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
