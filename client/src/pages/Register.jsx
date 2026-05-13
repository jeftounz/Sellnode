import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Importar el hook
import api from '../services/api';

const Register = () => {
  const { t } = useTranslation(); // 2. Inicializar t
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(''); 
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
      setError(t('auth.pass_error'));
      return;
    }

    setIsLoading(true);
    try {
      // Enviamos solo los campos que el backend espera
      const { name, email, password } = formData;
      await api.post('/auth/register', { 
        name: name.trim(), 
        email: email.trim(), 
        password 
      });
      navigate('/login');
    } catch (err) {
      const serverMessage = err.response?.data?.message || t('global.loading');
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {t('auth.register_title')}
          </h1>
          <p className="text-slate-500 font-medium">
            {t('auth.register_subtitle')}
          </p>
        </div>

        {error && (
          <div className="p-4 text-sm font-bold text-red-600 bg-red-50 rounded-2xl border border-red-100 animate-in shake duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              {t('auth.full_name')}
            </label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium" 
              placeholder={t('auth.name_placeholder')}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              {t('auth.email')}
            </label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium" 
              placeholder={t('auth.email_placeholder')}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              {t('auth.password')}
            </label>
            <input 
              required
              type="password" 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              {t('auth.confirm_password')}
            </label>
            <input 
              required
              type="password" 
              className={`w-full px-4 py-4 bg-slate-50 border rounded-2xl outline-none transition-all font-medium focus:ring-4 ${
                passwordsMatch === false ? 'border-red-300 focus:ring-red-50' : 'border-slate-200 focus:ring-indigo-100'
              }`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              disabled={isLoading}
            />
            
            {passwordsMatch !== null && (
              <p className={`mt-2 ml-1 text-xs font-bold uppercase tracking-wider ${
                passwordsMatch ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {passwordsMatch ? `✓ ${t('auth.pass_match')}` : `✗ ${t('auth.pass_mismatch')}`}
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
            {isLoading ? t('auth.registering') : t('auth.register_btn')}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium text-sm">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            {t('auth.login_here')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;