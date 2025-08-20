import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  getProductos as getProductosService, 
  createProducto, 
  updateProducto, 
  deleteProducto 
} from './services/productos.service';
import { 
  getVentas as getVentasService, 
  createVenta as createVentaService 
} from './services/ventas.service';
import './App.css';

// Importar la imagen (ajusta la ruta según el nombre real de tu archivo)
import XYTRONImage from './img/XYTRON.png'; // o './img/XYTRON.PNG'

// Componentes de la aplicación
const ProductoForm = ({ productoId, onSave, productoEditar }) => {
  const [producto, setProducto] = useState({
    nombre: '',
    tipo: 'juego',
    precio: 0,
    cantidad: 0
  });

  useEffect(() => {
    if (productoEditar) {
      setProducto(productoEditar);
    }
  }, [productoEditar]);

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
      if (!productoId) {
        setProducto({
          nombre: '',
          tipo: 'juego',
          precio: 0,
          cantidad: 0
        });
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="form-container">
      <h2>{productoId ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit} className="gamer-form">
        <div className="input-group">
          <label>Nombre del Producto:</label>
          <input 
            type="text" 
            name="nombre" 
            value={producto.nombre} 
            onChange={handleChange} 
            required 
            className="gamer-input"
          />
        </div>
        <div className="input-group">
          <label>Tipo:</label>
          <select name="tipo" value={producto.tipo} onChange={handleChange} className="gamer-select">
            <option value="juego">🎮 Juego</option>
            <option value="consola">🕹️ Consola</option>
          </select>
        </div>
        <div className="input-group">
          <label>Precio ($):</label>
          <input 
            type="number" 
            name="precio" 
            value={producto.precio} 
            onChange={handleChange} 
            min="0" 
            step="0.01" 
            required 
            className="gamer-input"
          />
        </div>
        <div className="input-group">
          <label>Cantidad en Stock:</label>
          <input 
            type="number" 
            name="cantidad" 
            value={producto.cantidad} 
            onChange={handleChange} 
            min="0" 
            required 
            className="gamer-input"
          />
        </div>
        <button type="submit" className="gamer-btn primary">
          {productoId ? 'Actualizar' : 'Agregar'} Producto
        </button>
      </form>
    </div>
  );
};

const ProductoList = ({ onEdit, productos, onDelete }) => {
  return (
    <div className="product-list">
      <h2>Catálogo de Productos</h2>
      <div className="product-grid">
        {productos.map(producto => (
          <div key={producto._id} className="product-card">
            <div className="product-header">
              <h3>{producto.nombre}</h3>
              <span className={`product-type ${producto.tipo}`}>
                {producto.tipo === 'juego' ? '🎮' : '🕹️'} {producto.tipo}
              </span>
            </div>
            <div className="product-details">
              <p className="product-price">${producto.precio.toFixed(2)}</p>
              <p className="product-stock">{producto.cantidad} en stock</p>
            </div>
            <div className="product-actions">
              <button onClick={() => onEdit(producto)} className="gamer-btn secondary">Editar</button>
              <button onClick={() => onDelete(producto._id)} className="gamer-btn danger">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VentaForm = ({ onSave, productos }) => {
  const [venta, setVenta] = useState({
    productoId: '',
    cantidad: 1
  });
  const [error, setError] = useState('');

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
      await createVentaService(venta);
      onSave();
      setVenta({
        productoId: '',
        cantidad: 1
      });
      alert('Venta registrada exitosamente!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al procesar la venta';
      setError(errorMessage);
      console.error('Error al realizar venta:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit} className="gamer-form">
        {error && <div className="error-message">⚠️ {error}</div>}
        <div className="input-group">
          <label>Seleccionar Producto:</label>
          <select 
            name="productoId" 
            value={venta.productoId} 
            onChange={handleChange}
            required
            className="gamer-select"
          >
            <option value="">Seleccione un producto</option>
            {productos.map(producto => (
              <option key={producto._id} value={producto._id}>
                {producto.nombre} - ${producto.precio.toFixed(2)} (Stock: {producto.cantidad})
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Cantidad:</label>
          <input 
            type="number" 
            name="cantidad" 
            value={venta.cantidad} 
            onChange={handleChange} 
            min="1" 
            required 
            className="gamer-input"
          />
        </div>
        <button type="submit" className="gamer-btn primary">Realizar Venta</button>
      </form>
    </div>
  );
};

const VentaList = ({ ventas }) => {
  return (
    <div className="venta-list">
      <h2>Historial de Ventas</h2>
      
      {/* Versión desktop (tabla) */}
      <div className="venta-table-container">
        {ventas.length === 0 ? (
          <p>No hay ventas registradas</p>
        ) : (
          <table className="venta-table">
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
                  <td>{venta.producto?.nombre || 'Producto eliminado'}</td>
                  <td>{venta.cantidadVendida}</td>
                  <td>${venta.total?.toFixed(2) || '0.00'}</td>
                  <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Versión móvil (tarjetas) */}
      <div className="venta-cards">
        {ventas.length === 0 ? (
          <p>No hay ventas registradas</p>
        ) : (
          ventas.map(venta => (
            <div key={venta._id} className="venta-card">
              <div className="venta-card-header">
                <div className="venta-card-product">
                  {venta.producto?.nombre || 'Producto eliminado'}
                </div>
              </div>
              <div className="venta-card-details">
                <div className="venta-card-detail">
                  <span className="venta-card-label">Cantidad</span>
                  <span className="venta-card-value">{venta.cantidadVendida}</span>
                </div>
                <div className="venta-card-detail">
                  <span className="venta-card-label">Total</span>
                  <span className="venta-card-value">${venta.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="venta-card-detail">
                  <span className="venta-card-label">Fecha</span>
                  <span className="venta-card-value">
                    {new Date(venta.fechaVenta).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Páginas
const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const response = await getProductosService();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await loadProductos();
    setProductoEditar(null);
  };

  const handleEdit = (producto) => {
    setProductoEditar(producto);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProducto(id);
        await loadProductos();
        alert('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Gestión de Productos</h1>
      <div className="page-content">
        <ProductoForm 
          productoId={productoEditar?._id} 
          onSave={handleSave} 
          productoEditar={productoEditar}
        />
        <ProductoList 
          onEdit={handleEdit} 
          productos={productos} 
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

const VentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVentas();
    loadProductos();
  }, []);

  const loadVentas = async () => {
    try {
      const response = await getVentasService();
      setVentas(response.data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      alert('Error al cargar ventas: ' + (error.response?.data?.error || error.message));
    }
  };

  const loadProductos = async () => {
    try {
      setLoading(true);
      const response = await getProductosService();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await loadVentas();
    await loadProductos();
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Gestión de Ventas</h1>
      <div className="page-content">
        <VentaForm onSave={handleSave} productos={productos} />
        <VentaList ventas={ventas} />
      </div>
    </div>
  );
};

const HomePage = () => {
  const [stats, setStats] = useState({ productos: 0, ventas: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productosRes, ventasRes] = await Promise.all([
        getProductosService(),
        getVentasService()
      ]);
      setStats({
        productos: productosRes.data.length,
        ventas: ventasRes.data.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Bienvenido a</h1>
            <div className="logo-container">
              <span className="logo-text">XYTRON</span>
              <span className="logo-subtext">GAMES</span>
            </div>
            <p>Tu destino definitivo para los mejores videojuegos y consolas</p>
          </div>
          <div className="hero-image">
            <img src={XYTRONImage} alt="XYTRON Games - Guerrero Épico" />
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat">
            <h3>{stats.productos}+</h3>
            <p>Productos en stock</p>
          </div>
          <div className="stat">
            <h3>{stats.ventas}+</h3>
            <p>Ventas realizadas</p>
          </div>
          <div className="stat">
            <h3>99%</h3>
            <p>Clientes satisfechos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <div className="App">
        <header className="gamer-header">
          <div className="header-content">
            <h1> Xytron Games</h1>
            <nav>
              <ul className="nav-menu">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/productos">Productos</Link></li>
                <li><Link to="/ventas">Ventas</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/ventas" element={<VentasPage />} />
          </Routes>
        </main>

        <footer className="gamer-footer">
          <p>&copy; 2025 Xytron Games - Todos los derechos reservados</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;