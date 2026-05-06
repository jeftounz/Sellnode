import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    userCount: 0,
    houseCount: 0,
    availableCount: 0,
    topPrice: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [uRes, hRes] = await Promise.all([
          api.get('/users'),
          api.get('/houses')
        ]);
        if (isMounted) {
          const houses = hRes.data;
          setStats({
            userCount: uRes.data.length,
            houseCount: houses.length,
            availableCount: houses.filter(h => h.status === 'disponible').length,
            topPrice: houses.length > 0 ? Math.max(...houses.map(h => h.price)) : 0
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="p-6 text-gray-500 font-medium">Cargando datos del panel...</div>;

  return (
    <div className="space-y-6">
      {/* Header idéntico a tu plantilla */}
      <header>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Bienvenido de vuelta, {user?.name}!
        </h1>
        <p className="text-gray-600 font-medium">Esto es lo ultimo de nuestras estadisticas.</p>
      </header>

      {/* Grid de Tarjetas idéntico a tu plantilla */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-700">Total Usuarios</h2>
          <p className="text-2xl font-bold text-green-600">{stats.userCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-600">
          <h2 className="text-lg font-semibold text-gray-700">Inmuebles Disponibles</h2>
          <p className="text-2xl font-bold text-yellow-600">{stats.availableCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <h2 className="text-lg font-semibold text-gray-700">Valor Propiedad Top</h2>
          <p className="text-2xl font-bold text-blue-600">${stats.topPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Sección Informativa Extra para completar el diseño */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tighter uppercase">Estado del Sistema</h3>
        <p className="text-sm text-gray-500">
          Actualmente el sistema tiene sincronizados <span className="font-bold">{stats.houseCount}</span> inmuebles totales. 
          Todas las peticiones están protegidas por encriptación y rate-limiting.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;