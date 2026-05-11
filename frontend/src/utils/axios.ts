import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { API_REQUEST_TIMEOUT_MS, BACKEND_URL } from '../config';

// ----------------------------------------------------------------------

function networkErrorMessage(error: AxiosError): string {
  const msg = (error.message || '').toLowerCase();
  if (error.code === 'ECONNABORTED' || msg.includes('timeout')) {
    return 'The server is taking too long to respond. If this is the first action after a while, wait a moment and try again (the API may be waking up).';
  }
  if (msg.includes('network') || error.code === 'ERR_NETWORK') {
    return 'Network error. Check your connection and that the API URL is correct.';
  }
  return error.message || 'Something went wrong';
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BACKEND_URL || '',
  timeout: API_REQUEST_TIMEOUT_MS > 0 ? API_REQUEST_TIMEOUT_MS : 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Adds Authorization header
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: surface API body; friendly messages when there is no HTTP response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    const data = error.response?.data;
    if (error.response) {
      return Promise.reject(data ?? { message: 'Request failed' });
    }
    return Promise.reject({ message: networkErrorMessage(error) });
  }
);

export default axiosInstance;
