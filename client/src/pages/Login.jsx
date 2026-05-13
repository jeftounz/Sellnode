import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
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
        await login({ email: email.trim(), password: password }); 
        navigate('/dashboard');
    } catch (err) {
        const serverMessage = err.response?.data?.message || t('global.loading'); 
        setError(serverMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sellnode-dark via-sellnode-primary to-sellnode-accent flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-md rounded-4xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-sellnode-dark tracking-tight">
            {t('auth.login_title')}
          </h1>
          <p className="text-slate-500 font-medium">
            {t('auth.login_subtitle')}
          </p>
        </div>

        {error && (
          <div className="p-4 text-sm font-bold text-red-600 bg-red-50/80 rounded-2xl border border-red-100">
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
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sellnode-primary/10 focus:border-sellnode-primary outline-none transition-all font-medium" 
              placeholder={t('auth.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                {t('auth.password')}
              </label>
              {/* Nuevo apartado: Olvidaste la cuenta */}
              <Link 
                to="/forgot-password" 
                className="text-[10px] font-black uppercase text-sellnode-primary hover:text-sellnode-dark transition-colors tracking-widest"
              >
                {t('auth.forgot_account')}
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sellnode-primary/10 focus:border-sellnode-primary outline-none transition-all font-medium" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-sellnode-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 font-black text-white rounded-2xl transition-all shadow-lg active:scale-95 ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-sellnode-primary hover:brightness-110 shadow-sellnode-primary/20'
            }`}
          >
            {isLoading ? t('auth.verifying') : t('auth.login_btn')}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 font-medium">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-sellnode-primary font-bold hover:underline">
            {t('auth.create_now')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;