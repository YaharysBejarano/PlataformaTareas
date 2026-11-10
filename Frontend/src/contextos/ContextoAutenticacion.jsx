import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/cliente';

const ContextoAutenticacion = createContext(null);

function guardarUsuario(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioStr = localStorage.getItem('user');

    if (!token) {
      setCargando(false);
      return;
    }

    if (usuarioStr) {
      setUsuario(JSON.parse(usuarioStr));
    }

    api
      .get('/auth/me')
      .then((res) => {
        setUsuario(res.data);
        guardarUsuario(res.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    guardarUsuario(user);
    setUsuario(user);
    return user;
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsuario(null);
  };

  const actualizarPerfil = async (datos) => {
    const res = await api.patch('/auth/me', datos);
    const user = res.data.user || res.data;
    guardarUsuario(user);
    setUsuario(user);
    return user;
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        user: usuario,
        loading: cargando,
        login: iniciarSesion,
        logout: cerrarSesion,
        actualizarPerfil,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAuth() {
  return useContext(ContextoAutenticacion);
}
