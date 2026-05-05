import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Building2,
  Activity,
  ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth(); // Obtenemos el nombre para el mensaje de bienvenida
  const [stats, setStats] = useState({
    userCount: 0,
    houseCount: 0,
    availableCount: 0,
    topHouses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        // Peticiones paralelas a tus endpoints de backend
        const [uRes, hRes] = await Promise.all([
          api.get('/users'),
          api.get('/houses')
        ]);

        if (isMounted) {
          const houses = hRes.data;
          // Ordenamos por precio descendente para la sección "Propiedad Top"[cite: 1]
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
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header de Bienvenida basado en tu plantilla */}
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          ¡Bienvenido de nuevo, {user?.name}!
        </h1>
        <p className="text-slate-500 font-medium">Esto es lo que está pasando con tu cuenta hoy.</p>
      </header>

      {/* Grid de Métricas - Diseño de tarjetas mejorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Usuarios" 
          value={stats.userCount} 
          icon={<Users size={24} />} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <MetricCard 
          title="Inmuebles" 
          value={stats.houseCount} 
          icon={<Building2 size={24} />} 
          color="text-emerald-600" 
          bg="bg-emerald-50" 
        />
        <MetricCard 
          title="Disponibles" 
          value={stats.availableCount} 
          icon={<Home size={24} />} 
          color="text-indigo-600" 
          bg="bg-indigo-50" 
        />
        <MetricCard 
          title="Propiedad Top" 
          value={`$${stats.topHouses[0]?.price?.toLocaleString() || 0}`} 
          icon={<TrendingUp size={24} />} 
          color="text-amber-600" 
          bg="bg-amber-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Propiedades de Alto Valor (Basado en la sección Orders de la plantilla) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <DollarSign size={20} className="text-indigo-600" /> 
              Propiedades de Alto Valor
            </h3>
            <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
              Ver todas <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.topHouses.map((house, index) => (
              <div key={house.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all group">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-700">{house.address}</p>
                    <p className="text-xs text-slate-400 font-medium">{house.city || 'Ubicación no especificada'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-indigo-600 font-black text-lg">
                    ${Number(house.price).toLocaleString()}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase">
                    {house.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Lateral de Actividad (Inspirada en el Sidebar visual de la plantilla) */}
        <div className="bg-indigo-900 p-8 rounded-4xl text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-xl">
              <Activity size={24} className="text-indigo-200" />
            </div>
            <h4 className="text-xl font-bold">Estado Global</h4>
          </div>
          
          <div className="space-y-6">
            <div className="pb-6 border-b border-white/10">
              <p className="text-indigo-200 text-sm mb-1">Capacidad de Inventario</p>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-400 h-full rounded-full" 
                  style={{ width: `${(stats.availableCount / (stats.houseCount || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-indigo-100 leading-relaxed italic">
              "El sistema está operando con un {((stats.availableCount / (stats.houseCount || 1)) * 100).toFixed(0)}% de inmuebles disponibles para la venta."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-componente de Tarjeta de Métrica estandarizado
const MetricCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </div>
    <div className={`p-4 ${bg} ${color} rounded-2xl shadow-inner`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;