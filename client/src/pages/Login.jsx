import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Importamos los iconos necesarios

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para el visor
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
        const serverMessage = err.response?.data?.message || 'Error de conexión con el servidor';
        setError(serverMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-4xl font-black text-center text-indigo-600 tracking-tighter">SELLNODE</h2>
        <p className="text-center text-slate-500 font-medium">Inicia sesión para gestionar el inventario</p>
        
        {error && (
          <div className="p-4 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email Corporativo</label>
            <input 
              type="email" 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium" 
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Contraseña</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium" 
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
            {isLoading ? 'Verificando...' : 'Acceder al Panel'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 font-medium">
          ¿Aún no eres parte? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Crea tu cuenta</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;