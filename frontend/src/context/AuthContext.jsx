import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('customer/');
                    setUser({ ...response.data.user, token });
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (username, password) => {
        const response = await api.post('auth/login/', { username, password });
        localStorage.setItem('token', response.data.token);
        setUser({ ...response.data.user, token: response.data.token });
    };

    const register = async (userData) => {
        const response = await api.post('auth/register/', userData);
        localStorage.setItem('token', response.data.token);
        setUser({ ...response.data.user, token: response.data.token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
