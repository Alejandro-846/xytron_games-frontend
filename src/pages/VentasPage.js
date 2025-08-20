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
    <div className="page-container ventas-page">
      <h1 className="page-title">Gestión de Ventas</h1>
      <div className="page-content">
        <VentaForm onSave={handleSave} productos={productos} />
        <VentaList ventas={ventas} />
      </div>
    </div>
  );
};