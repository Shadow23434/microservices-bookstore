/// <reference types="vite/client" />
import axios from 'axios';

const axiosClient = axios.create({
  // Base URL trống để ăn theo cấu hình proxy của Vite hoặc domain hiện tại
  baseURL: import.meta.env.VITE_API_BASE_URL || '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Tự động đính kèm Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho Response: Xử lý lỗi chung (VD: Hết hạn token)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý refresh token hoặc đá user ra trang Login
      console.log('Token hết hạn, vui lòng đăng nhập lại');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
