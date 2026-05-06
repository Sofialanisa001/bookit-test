import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES, ROLES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  // Se verifica si existen el token y el rol
  const { user, isAuthenticated } = useAuth();

  // Bandera para saber si la ruta que intentan ver es de admin
  const isAdminRoute = allowedRoles && allowedRoles.includes(ROLES.ADMIN);

  // Si no ha iniciado sesion
  if (!isAuthenticated) {
    // Si consulta una ruta de admin, redirige 404, sino a login
    return (
      <Navigate
        to={isAdminRoute ? ROUTES.NOT_FOUND : ROUTES.PUBLIC.LOGIN}
        replace
      />
    );
  }

  // Si inicio sesion pero no tiene permisos
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si un cliente trata de ir a una ruta del admin,
    // se le muestra 404
    if (isAdminRoute) {
      return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }

    // Si un admin intenta ver una pagina del cliente, se redirige al calendario, si es cliente
    const fallbackRoute =
      user.role === ROLES.ADMIN ? ROUTES.ADMIN.CALENDAR : ROUTES.CLIENT.MAIN;

    return <Navigate to={fallbackRoute} replace />;
  }

  // Si hay token, se permite el acceso a las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
