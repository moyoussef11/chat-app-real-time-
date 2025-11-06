import { BASE_URL } from './apiPaths';
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  // timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = '/login';
      } else if (error.response.status === 500) {
        console.error('server error please try again later');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout please try again');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
