import axiosClient from './axiosClient';

const bookService = {
  getAllBooks: (params?: any) => axiosClient.get('/api/books/', { params }),
  getBookById: (id: string | number) => axiosClient.get(`/api/books/${id}/`),
  getCategories: () => axiosClient.get('/api/books/categories/'),
};

export default bookService;
