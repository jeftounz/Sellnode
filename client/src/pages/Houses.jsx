import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { 
  Trash2, Edit, Plus, X, Building2, MapPin, Eye, Search, ChevronLeft, ChevronRight, AlertTriangle 
} from 'lucide-react';
import InfoDetailCard from '../components/InfoDetailCard';

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // Estados para Modales
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  
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

  const sanitizeInput = (str) => str.replace(/[<>]/g, "").trim();

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanAddress = sanitizeInput(formData.address);
    
    try {
      const payload = { ...formData, address: cleanAddress };
      if (editingHouse) {
        await api.put(`/houses/${editingHouse.id}`, payload);
      } else {
        await api.post('/houses', payload);
      }
      
      await fetchHouses(true);
      setIsModalOpen(false);
    } catch (err) {
      alert('Error al procesar la solicitud');
    }
  };

  const triggerDelete = (id) => {
    setHouseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!houseToDelete) return;
    try {
      await api.delete(`/houses/${houseToDelete}`);
      setHouses(prev => prev.filter(h => h.id !== houseToDelete));
      setIsDeleteModalOpen(false);
      setHouseToDelete(null);
      setSelectedHouse(null);
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el registro");
    }
  };

  const filteredHouses = houses.filter(house => {
    const matchesStatus = filter === 'all' || house.status === filter;
    const matchesSearch = house.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHouses = filteredHouses.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600">Cargando Inmuebles...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventario de Inmuebles</h1>
          <p className="text-slate-500 font-medium">Mostrando {currentHouses.length} de {filteredHouses.length} inmuebles filtrados.</p>
        </div>
        
        <button 
          onClick={() => { setEditingHouse(null); setFormData({ address: '', price: '', status: 'disponible' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all"
        >
          <Plus size={20} /> Registrar Venta
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-full md:w-fit">
          {['all', 'disponible', 'vendido'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por dirección..."
            maxLength={250}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentHouses.map(house => (
          <div key={house.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl transition-all">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Building2 size={24} /></div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedHouse(house)} className="p-2 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"><Eye size={18} /></button>
                  <button onClick={() => { setEditingHouse(house); setFormData({ address: house.address, price: house.price, status: house.status }); setIsModalOpen(true); }} className="p-2 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"><Edit size={18} /></button>
                  <button onClick={() => triggerDelete(house.id)} className="p-2 bg-slate-100 rounded-xl hover:bg-rose-600 hover:text-white transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                  <h4 className="font-bold text-slate-800 text-lg leading-tight truncate">{house.address}</h4>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Precio</p>
                    <p className="text-2xl font-black text-indigo-600">${Number(house.price).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${house.status === 'disponible' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {house.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 gap-4">
        <p className="text-sm font-bold text-slate-500">
          Mostrando {currentHouses.length > 0 ? startIndex + 1 : 0} a {startIndex + currentHouses.length} de {filteredHouses.length} registros
        </p>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 text-slate-600"><ChevronLeft size={20} /></button>
          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm">Página {currentPage} de {totalPages || 1}</span>
          <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 text-slate-600"><ChevronRight size={20} /></button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">¿Confirmar eliminación?</h2>
            <p className="text-slate-500 font-medium mb-8">
              ¿Desea eliminar el registro de este inmueble permanentemente?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 py-3 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                No, cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600 transition-transform"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 tracking-tight">{editingHouse ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Dirección Exacta (Max 250)</label>
                <input required maxLength={250} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Precio ($)</label>
                <input required type="number" min="0" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Estado</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="disponible">Disponible</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>
              <button type="submit" className="w-full p-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
      
      <InfoDetailCard isOpen={!!selectedHouse} onClose={() => setSelectedHouse(null)} title="Detalles" icon={Building2} data={{"Dirección": selectedHouse?.address, "Precio": `$${Number(selectedHouse?.price).toLocaleString()}`, "Estado": selectedHouse?.status?.toUpperCase()}} />
    </div>
  );
};

export default Houses;