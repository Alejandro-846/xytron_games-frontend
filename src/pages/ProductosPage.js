import React, { useState } from 'react';
import ProductoForm from '../components/ProductoForm';
import ProductoList from '../components/ProductoList';

const ProductosPage = () => {
  const [editingId, setEditingId] = useState(null);

  const handleSave = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h1>Gestión de Productos</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h2>{editingId ? 'Editar Producto' : 'Crear Producto'}</h2>
          <ProductoForm productoId={editingId} onSave={handleSave} />
        </div>
        <div style={{ flex: 2 }}>
          <ProductoList onEdit={setEditingId} />
        </div>
      </div>
    </div>
  );
};

export default ProductosPage;