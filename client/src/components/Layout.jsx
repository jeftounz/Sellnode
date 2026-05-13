import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, LogOut, Menu, X, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { t } = useTranslation();
  // Cambiamos a true si quieres que inicie abierto
  const [isSidebarOpen, setSidebarOpen] = useState(true); 
  const { logout, user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: t('layout.menu_dashboard'), path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: t('layout.menu_houses'), path: '/houses', icon: <Home size={20} /> },
    { name: t('layout.menu_users'), path: '/users', icon: <Users size={20} /> },
    { name: t('layout.menu_settings'), path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-xl transition-all duration-300 ease-in-out fixed md:relative inset-y-0 left-0 z-50 
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <nav className="flex flex-col h-full py-6">
          {/* Logo y Botón de Toggle para Escritorio */}
          <div className="flex items-center justify-between px-6 mb-10">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Home size={24} />
              </div>
              {isSidebarOpen && (
                <span className="ml-3 font-black text-xl text-gray-800 tracking-tighter animate-in fade-in duration-300">
                  Sellnode
                </span>
              )}
            </div>
            
            {/* Botón para colapsar/expandir en escritorio */}
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-1.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Items del Menú */}
          <div className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-2xl transition-all group relative
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                  <div className={`${isActive ? 'text-white' : 'group-hover:text-indigo-600'}`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <span className="ml-3 font-bold text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                      {item.name}
                    </span>
                  )}
                  
                  {/* Tooltip cuando está colapsado */}
                  {!isSidebarOpen && (
                    <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sección de Usuario y Salida */}
          <div className="px-4 mt-auto pt-6 border-t border-gray-50 space-y-4">
            <div className={`flex items-center px-4 ${!isSidebarOpen ? 'justify-center' : ''}`}>
              <div className="h-10 w-10 rounded-xl bg-indigo-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {isSidebarOpen && (
                <div className="ml-3 overflow-hidden animate-in fade-in duration-300">
                  <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-colors group"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {isSidebarOpen && (
                <span className="ml-3 font-bold text-sm animate-in fade-in">
                  {t('layout.exit')}
                </span>
              )}
            </button>
          </div>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Móvil */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Home size={18} />
            </div>
            <h1 className="text-xl font-black text-gray-800 tracking-tighter">Sellnode</h1>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-600">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;