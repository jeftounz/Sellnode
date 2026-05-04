import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Persistencia: Verificar si hay un token al cargar la app
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Aquí podrías hacer una petición opcional al backend para validar el token
            // Por ahora, asumimos que existe para no bloquear al usuario
            setUser({ loggedIn: true }); 
        }
        setLoading(false);
    }, []);

    // FIX: Ahora recibe un objeto con email y password (desestructuración)
    const login = async ({ email, password }) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            
            localStorage.setItem('token', data.token);
            setUser(data.user); // Guardamos los datos del usuario (id, name, email)
            
            return data;
        } catch (error) {
            // Lanzamos el error para que Login.jsx lo capture y lo muestre
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);