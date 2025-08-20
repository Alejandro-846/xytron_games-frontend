import React, { useState, useEffect } from 'react';
import { getProductos, deleteProducto } from '../services/productos.service';

const ProductoList = ({ onEdit }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const res = await getProductos();
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProducto(id);
      loadProductos();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto._id}>
              <td>{producto.nombre}</td>
              <td>{producto.tipo}</td>
              <td>${producto.precio.toFixed(2)}</td>
              <td>{producto.cantidad}</td>
              <td>
                <button onClick={() => onEdit(producto._id)}>Editar</button>
                <button onClick={() => handleDelete(producto._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoList;