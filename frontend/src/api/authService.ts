import axiosClient from './axiosClient';

const authService = {
  login: (data: any) => axiosClient.post('/api/users/login/', data),
  register: (data: any) => axiosClient.post('/api/users/register/', data),
  getProfile: () => axiosClient.get('/api/users/profile/'),
  updateProfile: (data: any) => axiosClient.put('/api/users/profile/', data),
};

export default authService;
