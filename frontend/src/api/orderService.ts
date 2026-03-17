import axiosClient from './axiosClient';

// Order service routes:
// GET  /api/orders/?customer_id=X  → Danh sách đơn hàng của customer
// POST /api/orders/                 → Tạo đơn hàng mới (kèm items, tự động tạo payment + shipment)
// GET  /api/orders/{id}/            → Chi tiết đơn hàng
// PATCH /api/orders/{id}/           → Cập nhật trạng thái đơn hàng
// POST /api/order-items/            → Thêm item vào đơn hàng đã có

const orderService = {
  // Lấy tất cả đơn hàng
  getOrders: () => axiosClient.get('/api/orders/'),
  // Lấy đơn hàng theo customer_id
  getOrdersByCustomer: (customerId: number) =>
    axiosClient.get('/api/orders/', { params: { customer_id: customerId } }),
  // Lấy chi tiết 1 đơn hàng
  getOrderById: (id: string | number) => axiosClient.get(`/api/orders/${id}/`),
  // Tạo đơn hàng mới kèm items, tự tạo payment + shipment
  // data: { customer_id, shipping_address, items: [{book_id, quantity, unit_price}], payment_method }
  createOrder: (data: any) => axiosClient.post('/api/orders/', data),
  // Cập nhật trạng thái đơn hàng (vd: 'shipped', 'delivered')
  updateOrder: (id: string | number, data: any) =>
    axiosClient.patch(`/api/orders/${id}/`, data),
  // Thêm item vào đơn hàng
  createOrderItem: (data: any) => axiosClient.post('/api/order-items/', data),
};

export default orderService;
