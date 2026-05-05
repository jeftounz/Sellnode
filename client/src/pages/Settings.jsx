import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  KeyRound 
} from 'lucide-react';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '' 
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Petición al endpoint de actualización del usuario actual
      const { data } = await api.put(`/users/${user.id}`, formData);
      
      // Actualizamos el contexto global para que el Sidebar refleje el cambio
      setUser(data.user);
      
      setStatus({ 
        type: 'success', 
        message: 'Perfil actualizado correctamente. Los cambios se verán reflejados en todo el sistema.' 
      });
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setStatus({ 
        type: 'error', 
        message: 'No se pudo actualizar el perfil. Verifica los datos e intenta de nuevo.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mi Perfil</h1>
        <p className="text-slate-500 font-medium">Gestiona tu información personal y credenciales de acceso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna de Resumen Visual */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-200 mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
            <p className="text-sm text-slate-400 font-medium mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} />
              Administrador
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-lg shadow-indigo-950/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <KeyRound size={20} className="text-indigo-200" />
              </div>
              <h4 className="font-bold">Seguridad</h4>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Tu sesión está protegida mediante encriptación JWT de nivel profesional y UUID v4.
            </p>
          </div>
        </div>

        {/* Columna del Formulario */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Información Básica</h3>
            
            {status.message && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300 ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                <CheckCircle2 size={20} />
                <p className="text-sm font-bold">{status.message}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">Este correo se utiliza para tu ingreso al sistema.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;