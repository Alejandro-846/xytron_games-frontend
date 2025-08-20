import React, { useState, useEffect } from 'react';
import { getVentas } from '../services/ventas.service';

const VentaList = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const loadVentas = async () => {
      try {
        const res = await getVentas();
        setVentas(res.data);
      } catch (error) {
        console.error('Error al cargar ventas:', error);
      }
    };
    loadVentas();
  }, []);

  return (
    <div>
      <h2>Historial de Ventas</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(venta => (
            <tr key={venta._id}>
              <td>{venta.producto?.nombre}</td>
              <td>{venta.cantidadVendida}</td>
              <td>${venta.total.toFixed(2)}</td>
              <td>{new Date(venta.fechaVenta).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentaList;