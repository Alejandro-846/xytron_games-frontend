import React, { useState, useEffect } from 'react';
import { getProducto, createProducto, updateProducto } from '../services/productos.service';

const ProductoForm = ({ productoId, onSave }) => {
  const [producto, setProducto] = useState({
    nombre: '',
    tipo: 'juego',
    precio: 0,
    cantidad: 0
  });

  useEffect(() => {
    if (productoId) {
      getProducto(productoId).then(res => setProducto(res.data));
    }
  }, [productoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'cantidad' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productoId) {
        await updateProducto(productoId, producto);
      } else {
        await createProducto(producto);
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input 
          type="text" 
          name="nombre" 
          value={producto.nombre} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div>
        <label>Tipo:</label>
        <select name="tipo" value={producto.tipo} onChange={handleChange}>
          <option value="juego">Juego</option>
          <option value="consola">Consola</option>
        </select>
      </div>
      <div>
        <label>Precio:</label>
        <input 
          type="number" 
          name="precio" 
          value={producto.precio} 
          onChange={handleChange} 
          min="0" 
          step="0.01" 
          required 
        />
      </div>
      <div>
        <label>Cantidad:</label>
        <input 
          type="number" 
          name="cantidad" 
          value={producto.cantidad} 
          onChange={handleChange} 
          min="0" 
          required 
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default ProductoForm;