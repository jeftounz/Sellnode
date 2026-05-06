import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Trash2, 
  Edit, 
  X, 
  ShieldCheck, 
  User, 
  Eye, 
  Search,
  AlertTriangle // Icono para el modal de advertencia
} from 'lucide-react';
import InfoDetailCard from '../components/InfoDetailCard';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Estados para el Modal de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', isActive: true });
  
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async (isMounted) => {
    try {
      const { data } = await api.get('/users');
      if (isMounted) setUsers(data);
    } catch (err) { 
      console.error("Error al cargar usuarios:", err); 
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchUsers(isMounted);
    return () => { isMounted = false; };
  }, [fetchUsers]);

  const sanitize = (text) => text.replace(/[<>]/g, "").trim();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const cleanData = {
        ...formData,
        name: sanitize(formData.name),
        email: sanitize(formData.email)
      };
      
      await api.put(`/users/${editingUser.id}`, cleanData);
      fetchUsers(true);
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) { 
      console.error(err);
      alert('Error al actualizar el usuario'); 
    }
  };

  // Abrir modal de confirmación
  const triggerDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Ejecutar eliminación real
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setSelectedUser(null);
    } catch (err) { 
      console.error(err);
      alert('Error al eliminar el usuario'); 
    }
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, isActive: u.isActive });
    setIsEditModalOpen(true);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Equipo Sellnode</h1>
          <p className="text-slate-500 font-medium tracking-tight">Gestión de accesos y colaboradores del sistema.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nombre o email..."
            maxLength={250}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-3xl border border-slate-100 overflow-hidden">
        <div className="max-h-[320px] overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Estatus</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-700">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      u.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => setSelectedUser(u)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Eye size={18} />
                    </button>
                    {u.id !== currentUser?.id ? (
                      <>
                        <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => triggerDelete(u)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <ShieldCheck size={18} className="inline-block text-indigo-300 ml-2" title="Tu Perfil" />
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-400 italic font-medium">
                    No se encontraron resultados para la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalle del Usuario */}
      <InfoDetailCard 
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name}
        icon={User}
        data={{
          "Correo Electrónico": selectedUser?.email,
          "Identificador": selectedUser?.id ? `${selectedUser.id.substring(0, 8)}...` : "N/A",
          "Estado de Cuenta": selectedUser?.isActive ? "ACTIVA" : "INACTIVA",
          "Nivel de Acceso": "Administrador"
        }}
        actions={selectedUser?.id !== currentUser?.id && (
          <>
            <button onClick={() => openEdit(selectedUser)} className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95">Editar</button>
            <button onClick={() => triggerDelete(selectedUser)} className="px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all"><Trash2 size={20}/></button>
          </>
        )}
      />

      {/* MODAL DE ELIMINACIÓN PERSONALIZADO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">¿Confirmar eliminación?</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              ¿Desea eliminar a <b>{userToDelete?.name}</b> del sistema permanentemente? Esta acción no se puede deshacer.
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
                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100 active:scale-95"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 tracking-tight">Modificar Usuario</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Nombre Completo (Max 250)</label>
                <input 
                  required 
                  maxLength={250}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium transition-all"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value.replace(/[<>]/g, "")})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Correo Electrónico (Max 250)</label>
                <input 
                  required 
                  type="email" 
                  maxLength={250}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium transition-all"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value.replace(/[<>]/g, "")})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 p-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors active:scale-95">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;