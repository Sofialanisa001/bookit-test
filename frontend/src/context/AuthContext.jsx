import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { setLogoutHandler } from '@/utils/authEvents';
import { postLogoutSession, postRefreshSession } from '@/api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // CONTEXTO
  const navigate = useNavigate();

  // ESTADOS
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // EFFECTS

  // Conecta axios con react
  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  // Intenta obtener los datos del usuario
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Intenta renovar la sesion
        await postRefreshSession();

        // Se intenta recuperar los datos del usuario
        const role = sessionStorage.getItem('role');
        const name = sessionStorage.getItem('userName');
        const email = sessionStorage.getItem('userEmail');

        if (role) {
          setUser({
            token: 'active',
            role,
            name,
            email,
          });
        } else {
          // Si faltan datos, la sesion es invalida
          throw new Error('Faltan datos de la sesión local');
        }
      } catch (error) {
        sessionStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Login
  const login = ({ token, role, name, email }) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('userEmail', email);

    setUser({ token, role, name, email });
  };

  // Actualiza los datos del usuario en tiempo real
  const updateUser = (newName, newEmail) => {
    if (user) {
      sessionStorage.setItem('userName', newName);
      sessionStorage.setItem('userEmail', newEmail);
      setUser((prevUser) => ({ ...prevUser, name: newName, email: newEmail }));
    }
  };

  // Logout
  const logout = async () => {
    setIsLoggingOut(true);

    try {
      // El back destruye la cookie
      await postLogoutSession();
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor', error);
    } finally {
      // Si o si se borran los datos y redirige a login
      sessionStorage.clear();
      setUser(null);
      navigate(ROUTES.PUBLIC.LOGIN, { replace: true });

      setTimeout(() => {
        setIsLoggingOut(false);
      }, 100);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isLoggingOut,
        isAuthenticated: !!user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};;

// Hook
export const useAuth = () => useContext(AuthContext);
