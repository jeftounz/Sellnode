import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Users, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center text-xl font-bold text-blue-600">
              <Home className="mr-2" /> Sellnode
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Inmuebles</Link>
              <Link to="/users" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Usuarios</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Hola, {user?.name}</span>
            <button onClick={logout} className="flex items-center text-red-500 hover:text-red-700 font-medium text-sm">
              <LogOut size={18} className="mr-1" /> Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;