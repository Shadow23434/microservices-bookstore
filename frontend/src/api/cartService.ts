import axiosClient from './axiosClient';

const cartService = {
  getCart: () => axiosClient.get('/api/orders/cart/'),
  addToCart: (data: any) => axiosClient.post('/api/orders/cart/add/', data),
  updateCartItem: (id: string | number, data: any) => axiosClient.put(`/api/orders/cart/${id}/`, data),
  removeFromCart: (id: string | number) => axiosClient.delete(`/api/orders/cart/${id}/`),
  clearCart: () => axiosClient.delete('/api/orders/cart/clear/'),
};

export default cartService;
