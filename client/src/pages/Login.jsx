import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos
    setIsLoading(true);

    try {
        // .trim() evita errores por espacios accidentales al final del email
        await login({ 
          email: email.trim(), 
          password: password 
        }); 
        
        // Si el login es exitoso, redirigimos al dashboard
        navigate('/dashboard');
    } catch (err) {
        // Extraemos el mensaje de error que configuramos en el backend
        const serverMessage = err.response?.data?.message || 'Error de conexión con el servidor';
        setError(serverMessage);
        console.error("Detalle del error en login:", err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-600">Sellnode</h2>
        <p className="text-center text-gray-500">Inicia sesión para gestionar tus ventas</p>
        
        {/* Mostramos el error si existe */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-pulse">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email corporativo</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2 font-semibold text-white rounded-lg transition-all ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-600 font-medium hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;