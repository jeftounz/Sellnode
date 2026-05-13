import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar el hook
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
  AlertTriangle 
} from 'lucide-react';
import InfoDetailCard from '../components/InfoDetailCard';

const Users = () => {
  const { t } = useTranslation(); // 2. Inicializar t
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
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (isMounted) => {
    try {
      const { data } = await api.get('/users');
      if (isMounted) setUsers(data);
    } catch (err) { 
      console.error("Error al cargar usuarios:", err); 
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchUsers(isMounted);
    return () => { isMounted = false; };
  }, [fetchUsers]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingUser.id}`, formData);
      await fetchUsers(true);
      setIsEditModalOpen(false);
    } catch (err) {
      alert(t('users.self_delete_error'));
    }
  };

  const triggerDelete = (id) => {
    if (id === currentUser.id) {
      alert(t('users.self_delete_error'));
      return;
    }
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${userToDelete}`);
      setUsers(users.filter(u => u.id !== userToDelete));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      alert(t('users.self_delete_error'));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600">{t('global.loading')}</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('users.title')}</h1>
          <p className="text-slate-500 font-medium">{t('auth.register_subtitle')}</p>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder={t('users.search_placeholder')}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t('users.table_name')}</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t('global.status')}</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">{t('global.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-none mb-1">{u.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {u.isActive ? t('users.status_active') : t('users.status_inactive')}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedUser(u)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => { setEditingUser(u); setFormData({ name: u.name, email: u.email, isActive: u.isActive }); setIsEditModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => triggerDelete(u.id)} className={`p-2 rounded-xl transition-all ${u.id === currentUser.id ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle */}
      <InfoDetailCard 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        title={t('auth.full_name')} 
        icon={User} 
        data={{
          [t('users.table_name')]: selectedUser?.name,
          [t('users.table_email')]: selectedUser?.email,
          [t('global.status')]: selectedUser?.isActive ? t('users.status_active') : t('users.status_inactive')
        }} 
      />

      {/* Modal de Eliminación (Confirmación) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t('users.security_warn')}</h2>
            <p className="text-slate-500 font-medium mb-8">
              {t('users.delete_msg')} <br/>
              <span className="text-xs font-bold text-rose-400">{t('users.delete_warning')}</span>
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 py-3 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                {t('global.cancel')}
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
              >
                {t('global.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600 transition-transform">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 tracking-tight">{t('users.modal_edit')}</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">{t('users.name_label')}</label>
                <input 
                  required 
                  maxLength={250}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium transition-all"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value.replace(/[<>]/g, "")})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">{t('users.email_label')}</label>
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
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                  {t('global.cancel')}
                </button>
                <button type="submit" className="flex-1 p-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors active:scale-95">
                  {t('global.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;