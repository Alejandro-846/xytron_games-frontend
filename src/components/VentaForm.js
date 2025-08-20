import React, { useState, useEffect } from 'react';
import { getProductos } from '../services/productos.service';
import { createVenta } from '../services/ventas.service';

const VentaForm = ({ onSave }) => {
  const [productos, setProductos] = useState([]);
  const [venta, setVenta] = useState({
    productoId: '',
    cantidad: 1
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const res = await getProductos();
        setProductos(res.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    loadProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenta(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createVenta(venta);
      onSave();
    } catch (error) {
      setError(error.response?.data?.error || 'Error al procesar la venta');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Producto:</label>
        <select 
          name="productoId" 
          value={venta.productoId} 
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un producto</option>
          {productos.map(producto => (
            <option key={producto._id} value={producto._id}>
              {producto.nombre} (Stock: {producto.cantidad})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Cantidad:</label>
        <input 
          type="number" 
          name="cantidad" 
          value={venta.cantidad} 
          onChange={handleChange} 
          min="1" 
          required 
        />
      </div>
      <button type="submit">Realizar Venta</button>
    </form>
  );
};

export default VentaForm;