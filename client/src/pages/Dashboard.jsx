import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Filter } from 'lucide-react';

const Dashboard = () => {
  const [houses, setHouses] = useState([]);
  const [filter, setFilter] = useState(''); // '' | 'disponible' | 'vendido'
  const [showModal, setShowModal] = useState(false);
  const [newHouse, setNewHouse] = useState({ address: '', price: '', status: 'disponible' });

  const fetchHouses = async () => {
    const url = filter ? `/houses?status=${filter}` : '/houses';
    const { data } = await api.get(url);
    setHouses(data);
  };

  useEffect(() => { fetchHouses(); }, [filter]);

  const handleAddHouse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/houses', newHouse);
      setShowModal(false);
      setNewHouse({ address: '', price: '', status: 'disponible' });
      fetchHouses();
    } catch (err) { alert('Error al registrar venta'); }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Inmuebles</h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            {/* Filtro de Estado */}
            <select 
              className="px-4 py-2 border rounded-lg bg-white shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="disponible">Disponibles</option>
              <option value="vendido">Vendidos</option>
            </select>

            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
            >
              <Plus size={20} className="mr-2" /> Nueva Venta
            </button>
          </div>
        </div>

        {/* Listado de Inmuebles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map(house => (
            <div key={house.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">{house.address}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    house.status === 'disponible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {house.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-2xl font-black text-blue-600 mt-2">${Number(house.price).toLocaleString()}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-sm text-gray-500">
                  <span>Vendedor: {house.seller?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Registro (AddInmueble) */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Registrar Inmueble</h2>
              <form onSubmit={handleAddHouse} className="space-y-4">
                <input 
                  type="text" placeholder="Dirección completa" required
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newHouse.address}
                  onChange={(e) => setNewHouse({...newHouse, address: e.target.value})}
                />
                <input 
                  type="number" placeholder="Precio ($)" required
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newHouse.price}
                  onChange={(e) => setNewHouse({...newHouse, price: e.target.value})}
                />
                <select 
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newHouse.status}
                  onChange={(e) => setNewHouse({...newHouse, status: e.target.value})}
                >
                  <option value="disponible">Disponible</option>
                  <option value="vendido">Vendido</option>
                </select>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-gray-600 font-medium">Cancelar</button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;