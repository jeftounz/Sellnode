/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Persistencia: Verificar sesión al cargar
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const savedUser = JSON.parse(localStorage.getItem('user'));
                    if (savedUser) {
                        setUser(savedUser);
                    } else {
                        // Si hay token pero no objeto user, marcamos como logueado genérico
                        setUser({ loggedIn: true }); 
                    }
                } catch (error) {
                    console.error("Error al parsear usuario del localStorage:", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // 1. SOLUCIÓN AL ERROR: no-useless-catch
    // Eliminamos el try/catch innecesario. Si solo vas a lanzar el error (throw), 
    // es mejor dejar que la promesa se rechace sola para que el componente 
    // (Login.jsx o Settings.jsx) capture el error en su propio bloque catch.
    const login = async ({ email, password }) => {
        const { data } = await api.post('/auth/login', { email, password });
        
        localStorage.setItem('token', data.token);
        // Guardamos el objeto user completo para que Settings.jsx tenga el ID tras F5
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user); 
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        // Mantenemos setUser en el value para corregir el fallo de Settings.jsx
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 2. SOLUCIÓN AL ERROR: react-refresh/only-export-components
// Fast Refresh requiere que los archivos .jsx solo exporten componentes de React.
// Al exportar el hook 'useAuth', el linter advierte que esto podría romper el Refresh.
// La solución estándar es deshabilitar la regla para este archivo de contexto 
// o mover el hook a un archivo separado.
export const useAuth = () => useContext(AuthContext);