import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const { name, email, password } = formData;
      await api.post('/auth/register', { name: name.trim(), email: email.trim(), password });
      navigate('/login');
    } catch (err) {
      const serverMessage = err.response?.data?.message || t('global.loading');
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sellnode-dark via-sellnode-primary to-sellnode-accent flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-md rounded-4xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-sellnode-dark tracking-tight">
            {t('auth.register_title')}
          </h1>
          <p className="text-slate-500 font-medium">
            {t('auth.register_subtitle')}
          </p>
        </div>

        {error && (
          <div className="p-4 text-sm font-bold text-red-600 bg-red-50/80 rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">{t('auth.full_name')}</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sellnode-primary/10 focus:border-sellnode-primary outline-none transition-all font-medium" 
              placeholder={t('auth.name_placeholder')}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">{t('auth.email')}</label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sellnode-primary/10 focus:border-sellnode-primary outline-none transition-all font-medium" 
              placeholder={t('auth.email_placeholder')}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">{t('auth.password')}</label>
            <input 
              required
              type="password" 
              className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sellnode-primary/10 focus:border-sellnode-primary outline-none transition-all font-medium" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">{t('auth.confirm_password')}</label>
            <input 
              required
              type="password" 
              className={`w-full px-4 py-4 bg-white border rounded-2xl outline-none transition-all font-medium focus:ring-4 ${
                passwordsMatch === false ? 'border-red-300 focus:ring-red-50' : 'border-slate-200 focus:ring-sellnode-primary/10'
              }`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              disabled={isLoading}
            />
            {passwordsMatch !== null && (
              <p className={`mt-2 ml-1 text-xs font-bold uppercase tracking-wider ${passwordsMatch ? 'text-sellnode-accent' : 'text-red-500'}`}>
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
              : 'bg-sellnode-primary hover:brightness-110 shadow-sellnode-primary/20'
            }`}
          >
            {isLoading ? t('auth.registering') : t('auth.register_btn')}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium text-sm">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="text-sellnode-primary font-bold hover:underline">
            {t('auth.login_here')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;