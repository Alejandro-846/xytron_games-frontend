import api from './api';

export const getVentas = () => api.get('/ventas');
export const createVenta = (venta) => api.post('/ventas', venta);