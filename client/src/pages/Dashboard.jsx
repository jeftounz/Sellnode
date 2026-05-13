import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar el hook de traducción
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation(); // 2. Inicializar t
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

  if (loading) return (
    <div className="p-10 text-center font-bold text-indigo-600">
      {t('global.loading')}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Título Principal */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tighter">
          {t('dashboard.title')}
        </h1>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-700">
            {t('dashboard.total_users')}
          </h2>
          <p className="text-2xl font-bold text-green-600">{stats.userCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-600">
          <h2 className="text-lg font-semibold text-gray-700">
            {t('dashboard.available_houses')}
          </h2>
          <p className="text-2xl font-bold text-yellow-600">{stats.availableCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <h2 className="text-lg font-semibold text-gray-700">
            {t('dashboard.top_price')}
          </h2>
          <p className="text-2xl font-bold text-blue-600">
            ${stats.topPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sección Informativa Extra (Sección estética) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tighter uppercase">
          {t('global.status')}
        </h3>
        <p className="text-gray-600 text-sm italic">
          {t('settings.language_hint')}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;