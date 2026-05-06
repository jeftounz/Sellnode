import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(''); // Estado para mensaje de error (email duplicado, etc)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validación de coincidencia en tiempo real
  const passwordsMatch = formData.password && formData.confirmPassword 
    ? formData.password === formData.confirmPassword 
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas deben ser idénticas para continuar');
      return;
    }

    setIsLoading(true);
    try {
      // Enviamos solo los campos que el backend espera
      const { name, email, password } = formData;
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      // Capturamos el error del backend (ej: "Email ya registrado")
      const serverMessage = err.response?.data?.message || 'Error durante el registro';
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <h2 className="text-3xl font-black text-center text-slate-800 mb-2 tracking-tight">Crear Cuenta</h2>
        <p className="text-center text-slate-400 font-medium mb-8">Únete al equipo de administración</p>

        {error && (
          <div className="mb-6 p-4 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl animate-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Nombre Completo</label>
            <input 
              type="text" placeholder="Ej: John Doe" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Correo Electrónico</label>
            <input 
              type="email" placeholder="email@sellnode.com" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Contraseña</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Confirmar Contraseña</label>
            <input 
              type="password" placeholder="••••••••" required
              className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none transition-all font-medium ${
                passwordsMatch === false ? 'border-red-300 focus:ring-red-50' : 'border-slate-200 focus:ring-indigo-100'
              }`}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              disabled={isLoading}
            />
            {/* Mensajito discreto debajo del input */}
            {passwordsMatch !== null && (
              <p className={`mt-2 ml-1 text-xs font-bold uppercase tracking-wider ${
                passwordsMatch ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {passwordsMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || passwordsMatch === false}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 ${
              isLoading || passwordsMatch === false 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isLoading ? 'Registrando...' : 'Finalizar Registro'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-600 font-black hover:underline ml-1">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;