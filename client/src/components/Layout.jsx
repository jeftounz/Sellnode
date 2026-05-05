import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, LogOut, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-950 text-slate-200 transition-all duration-300 flex flex-col shadow-2xl z-20`}>
        <div className="p-6 flex justify-between items-center border-b border-indigo-900/50">
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-white">SELLNODE</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-indigo-800 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-indigo-900/50 hover:text-white'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-900/50">
          <div className={`flex items-center ${isSidebarOpen ? 'px-2' : 'justify-center'} mb-4`}>
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && <span className="ml-3 text-sm font-semibold truncate">{user?.name}</span>}
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center w-full p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4 font-bold">Salir</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-slate-500 font-medium capitalize">
            {location.pathname.replace('/', '')}
          </h2>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;