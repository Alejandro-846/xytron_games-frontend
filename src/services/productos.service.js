import api from './api';

export const getProductos = () => api.get('/productos');
export const getProducto = (id) => api.get(`/productos/${id}`);
export const createProducto = (producto) => api.post('/productos', producto);
export const updateProducto = (id, producto) => api.put(`/productos/${id}`, producto);
export const deleteProducto = (id) => api.delete(`/productos/${id}`);