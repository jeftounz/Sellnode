import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  Building2, 
  MapPin, 
  Eye 
} from 'lucide-react';
import InfoDetailCard from '../components/InfoDetailCard';

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [formData, setFormData] = useState({ address: '', price: '', status: 'disponible' });
  const [loading, setLoading] = useState(true);

  const fetchHouses = useCallback(async (isMounted) => {
    try {
      const { data } = await api.get('/houses');
      if (isMounted) setHouses(data);
    } catch (err) {
      console.error("Error al obtener inmuebles:", err);
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchHouses(isMounted);
    return () => { isMounted = false; };
  }, [fetchHouses]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingHouse) {
        await api.put(`/houses/${editingHouse.id}`, formData);
      } else {
        await api.post('/houses', formData);
      }
      
      const { data } = await api.get('/houses');
      setHouses(data);
      setIsModalOpen(false);
      setSelectedHouse(null);
    } catch (err) {
      console.error("Error al guardar:", err);
      alert('Error al procesar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este inmueble permanentemente?')) {
      try {
        await api.delete(`/houses/${id}`);
        setHouses(prev => prev.filter(h => h.id !== id));
        setSelectedHouse(null);
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  const openModal = (house = null) => {
    if (house) {
      setEditingHouse(house);
      setFormData({ address: house.address, price: house.price, status: house.status });
    } else {
      setEditingHouse(null);
      setFormData({ address: '', price: '', status: 'disponible' });
    }
    setIsModalOpen(true);
    setSelectedHouse(null);
  };

  const filteredHouses = filter === 'all' ? houses : houses.filter(h => h.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventario de Inmuebles</h1>
          <p className="text-slate-500 font-medium tracking-tight">Gestiona y filtra las propiedades registradas en Sellnode.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Registrar Venta</span>
        </button>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
        {['all', 'disponible', 'vendido'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
              filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            {f === 'all' ? 'Todos' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHouses.map(house => (
          <div key={house.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl transition-all">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Building2 size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedHouse(house)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors" title="Ver Detalles">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => openModal(house)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors" title="Editar">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(house.id)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-600 hover:text-white transition-colors" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                  <h4 className="font-bold text-slate-800 text-lg leading-tight truncate">{house.address}</h4>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Precio</p>
                    <p className="text-2xl font-black text-indigo-600">${Number(house.price).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    house.status === 'disponible' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {house.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InfoDetailCard 
        isOpen={!!selectedHouse}
        onClose={() => setSelectedHouse(null)}
        title="Detalles del Inmueble"
        icon={Building2}
        data={{
          "Dirección": selectedHouse?.address,
          "Precio": `$${Number(selectedHouse?.price).toLocaleString()}`,
          "Estado": selectedHouse?.status.toUpperCase(),
          "ID Registro": selectedHouse?.id.substring(0, 8),
          "Vendedor": selectedHouse?.seller?.name || "Asignado"
        }}
        actions={
          <>
            <button 
              onClick={() => openModal(selectedHouse)} 
              className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95"
            >
              Editar Inmueble
            </button>
            <button 
              onClick={() => handleDelete(selectedHouse.id)} 
              className="px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all"
            >
              <Trash2 size={20}/>
            </button>
          </>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600 transition-transform">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              {editingHouse ? 'Editar Propiedad' : 'Registrar Nueva Venta'}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Dirección Exacta</label>
                <input 
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Precio ($)</label>
                <input 
                  required
                  type="number"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Estado</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-slate-700"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="disponible">Disponible</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 p-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Houses;