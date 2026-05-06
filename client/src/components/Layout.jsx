import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, LogOut, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Extraemos logout y user. Ahora usaremos 'user' para el avatar inferior.
  const { logout, user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Inmuebles', path: '/houses', icon: <Home size={20} /> },
    { name: 'Usuarios', path: '/users', icon: <Users size={20} /> },
    { name: 'Ajustes', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      {/* Sidebar - Fiel a tu diseño HTML */}
      <aside 
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-50 
          ${isSidebarOpen ? 'w-64' : 'w-20 md:w-64'} 
          ${!isSidebarOpen ? 'hidden md:block' : 'block'}`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h1 className={`text-xl font-bold text-green-600 transition-opacity duration-300 
            ${!isSidebarOpen ? 'md:opacity-100 opacity-0' : 'opacity-100'}`}>
            Sellnode
          </h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 rounded-full hover:bg-gray-200">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="py-4 flex flex-col h-[calc(100vh-65px)]">
          <ul className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2 transition-colors rounded-lg mx-2
                    ${location.pathname === item.path ? 'bg-gray-100 text-green-600 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="text-gray-600">{item.icon}</span>
                  <span className={`transition-opacity duration-300 ${!isSidebarOpen ? 'md:block hidden' : 'block'}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* SECCIÓN DE USUARIO: Aquí usamos la variable 'user' para corregir el error[cite: 3] */}
          <div className="p-4 border-t border-gray-100">
            <div className={`flex items-center space-x-3 mb-4 px-2 ${!isSidebarOpen ? 'md:justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>
                <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center space-x-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className={`font-medium ${!isSidebarOpen ? 'md:block hidden' : 'block'}`}>Salir</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Sellnode</h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-200">
            <Menu size={24} />
          </button>
        </div>

        <div className="animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;