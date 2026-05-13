import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; 
import { useTranslation } from 'react-i18next'; // 1. Importar el hook

const Login = () => {
  const { t } = useTranslation(); // 2. Inicializar t
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        await login({ 
          email: email.trim(), 
          password: password 
        }); 
        navigate('/dashboard');
    } catch (err) {
        // Se puede traducir también el mensaje de error por defecto si el servidor no responde
        const serverMessage = err.response?.data?.message || t('global.loading'); 
        setError(serverMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {t('auth.login_title')}
          </h1>
          <p className="text-slate-500 font-medium">
            {t('auth.login_subtitle')}
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
              {t('auth.email')}
            </label>
            <input 
              type="email" 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium" 
              placeholder={t('auth.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              {t('auth.password')}
            </label>
            <input 
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            {/* Botón visor de contraseña */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 font-black text-white rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95 ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? t('auth.verifying') : t('auth.login_btn')}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 font-medium">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            {t('auth.create_now')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;