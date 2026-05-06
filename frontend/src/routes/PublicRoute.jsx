import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES, ROLES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';

const PublicRoute = () => {
  const { user, isAuthenticated } = useAuth();

  // Si el usuario ya tiene token, se le expulsa de las ruta publica
  if (isAuthenticated) {
    const fallbackRoute =
      user.role === ROLES.ADMIN ? ROUTES.ADMIN.CALENDAR : ROUTES.CLIENT.MAIN;

    return <Navigate to={fallbackRoute} replace />;
  }

  // Si no tiene token, puede ver las rutas hijas
  return <Outlet />;
};

export default PublicRoute;
