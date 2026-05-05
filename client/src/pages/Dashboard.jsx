import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Building2 
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    houseCount: 0,
    availableCount: 0,
    topHouses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Definimos la función dentro para evitar errores de dependencias y cascading renders
    const loadDashboardData = async () => {
      try {
        const [uRes, hRes] = await Promise.all([
          api.get('/users'),
          api.get('/houses')
        ]);

        if (isMounted) {
          const houses = hRes.data;
          const sorted = [...houses].sort((a, b) => b.price - a.price).slice(0, 3);
          
          setStats({
            userCount: uRes.data.length,
            houseCount: houses.length,
            availableCount: houses.filter(h => h.status === 'disponible').length,
            topHouses: sorted
          });
        }
      } catch (err) {
        console.error("Error en Dashboard:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Panel de Control</h1>
        <p className="text-slate-500 font-medium">Resumen general de operaciones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Usuarios" value={stats.userCount} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <MetricCard title="Inmuebles" value={stats.houseCount} icon={<Building2 className="text-emerald-600" />} color="bg-emerald-50" />
        <MetricCard title="Disponibles" value={stats.availableCount} icon={<Home className="text-indigo-600" />} color="bg-indigo-50" />
        <MetricCard title="Propiedad Top" value={`$${stats.topHouses[0]?.price?.toLocaleString() || 0}`} icon={<TrendingUp className="text-amber-600" />} color="bg-amber-50" />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <DollarSign size={20} className="text-indigo-600" /> Propiedades de Alto Valor
        </h3>
        <div className="space-y-4">
          {stats.topHouses.map((house, index) => (
            <div key={house.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-indigo-600 shadow-sm">{index + 1}</span>
                <span className="font-bold text-slate-700">{house.address}</span>
              </div>
              <span className="text-indigo-600 font-black text-lg">${Number(house.price).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </div>
    <div className={`p-4 ${color} rounded-2xl`}>{icon}</div>
  </div>
);

export default Dashboard;