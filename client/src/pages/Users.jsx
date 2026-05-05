import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, X, ShieldCheck, User, Eye } from 'lucide-react';
import InfoDetailCard from '../components/InfoDetailCard';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Para ver detalles
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', isActive: true });
  
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async (isMounted) => {
    try {
      const { data } = await api.get('/users');
      if (isMounted) setUsers(data);
    } catch (err) { console.error(err); }
  }, []);/*Error*/

  useEffect(() => {
    let isMounted = true;
    fetchUsers(isMounted);/*Error:  */
    return () => { isMounted = false; };
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario del sistema?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
        setSelectedUser(null);
      } catch (err) { alert('Error al eliminar'); }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingUser.id}`, formData);
      fetchUsers(true);
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) { alert('Error al actualizar'); }/*Error: 'err' is defined but never used.eslintno-unused-vars
(local var) err: unknown*/
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, isActive: u.isActive });
    setIsEditModalOpen(true);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Equipo Sellnode</h1>
        <p className="text-slate-500 font-medium">Gestión administrativa de usuarios y accesos.</p>
      </div>

      <div className="bg-white shadow-xl rounded-3xl border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Colaborador</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Estatus</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    u.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setSelectedUser(u)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Ver Detalle">
                    <Eye size={18} />
                  </button>
                  {u.id !== currentUser?.id ? (
                    <>
                      <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <ShieldCheck size={18} className="inline-block text-indigo-300 ml-2" title="Tu Perfil" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. CARTA DE DETALLE INDIVIDUAL (Reutilizable) */}
      <InfoDetailCard 
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name}
        icon={User}
        data={{
          "Correo": selectedUser?.email,
          "ID": selectedUser?.id.substring(0, 8) + "...",
          "Estado": selectedUser?.isActive ? "Cuenta Activa" : "Cuenta Suspendida",
          "Rol": "Administrador"
        }}
        actions={selectedUser?.id !== currentUser?.id && (
          <>
            <button onClick={() => openEdit(selectedUser)} className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700">Editar Datos</button>
            <button onClick={() => handleDelete(selectedUser.id)} className="px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100"><Trash2 size={20}/></button>
          </>
        )}
      />

      {/* MODAL DE EDICIÓN SIMPLE */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Modificar Usuario</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input 
                required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                required type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200">Cancelar</button>
                <button type="submit" className="flex-1 p-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;