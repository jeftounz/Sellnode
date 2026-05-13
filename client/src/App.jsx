import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importación de Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Houses from './pages/Houses'; // Tu nueva página de inmuebles
import Settings from './pages/Settings';
import './i18n';
// import Settings from './pages/Settings'; // Para el futuro

// Importación del Layout (El que tiene el Sidebar)
import Layout from './components/Layout';

// Componente de Ruta Privada
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas (Sin Sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 
            RUTAS PROTEGIDAS CON LAYOUT PERSISTENTE 
            El componente <Layout /> contiene el Sidebar y el <Outlet />
          */}
          <Route 
            element={
              <PrivateRoute>
                <Layout /> 
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/houses" element={<Houses />} />
            <Route path="/settings" element={<Settings />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;