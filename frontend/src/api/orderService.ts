import axiosClient from './axiosClient';

const orderService = {
  createOrder: (data: any) => axiosClient.post('/api/orders/', data),
  getOrders: () => axiosClient.get('/api/orders/'),
  getOrderById: (id: string | number) => axiosClient.get(`/api/orders/${id}/`),
};

export default orderService;
