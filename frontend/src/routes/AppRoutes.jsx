// React
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Constantes
import { ROUTES, ROLES } from '@/constants/routes';

// Context
import { useAuth } from '@/context/AuthContext';

// Componentes
import Loader from '@/components/common/Loader';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import ClientLayout from '@/layouts/ClientLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Paginas Auth
const Login = lazy(() => import('@/pages/auth/Login.jsx'));
const Signup = lazy(() => import('@/pages/auth/Signup.jsx'));

// Paginas Client
const MainPage = lazy(() => import('@/pages/client/MainPage'));
const BookAppointment = lazy(() => import('@/pages/client/BookAppointment'));
const MyAppointments = lazy(() => import('@/pages/client/MyAppointments'));
const Profile = lazy(() => import('@/pages/client/Profile'));

// Paginas Admin
const AppointmentCalendar = lazy(
  () => import('@/pages/admin/AppointmentCalendar'),
);
const AdminBookAppointment = lazy(
  () => import('@/pages/admin/AdminBookAppointment'),
);
const Employees = lazy(() => import('@/pages/admin/Employees'));
const Services = lazy(() => import('@/pages/admin/Services'));
const CompanyInfo = lazy(() => import('@/pages/admin/CompanyInfo'));
const Suspensions = lazy(() => import('@/pages/admin/Suspensions'));
const Reports = lazy(() => import('@/pages/admin/Reports'));

// Pagina Error
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

// Rutas protegidas
import PublicRoute from '@/routes/PublicRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';

// <--------------------------------------------------------->

// Muestra algo mientras se carga un componente
const SuspenseLayout = ({ children }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

const AppRoutes = () => {
  // Estado de carga desde el contexto
  const { loading, isLoggingOut } = useAuth();

  // Si esta verificando o cerrando sesion, 
  // se muestra la pantalla de carga
  if (loading || isLoggingOut) return <Loader />;
  return (
    <Routes>
      {/* Rutas publicas */}
      <Route element={<PublicRoute />}>
        {/* Landing Page */}
        <Route
          element={
            <SuspenseLayout>
              <ClientLayout />
            </SuspenseLayout>
          }
        >
          <Route path={ROUTES.PUBLIC.ROOT} element={<MainPage />} />
        </Route>

        {/* Auth */}
        <Route
          element={
            <SuspenseLayout>
              <AuthLayout />
            </SuspenseLayout>
          }
        >
          <Route path={ROUTES.PUBLIC.LOGIN} element={<Login />} />
          <Route path={ROUTES.PUBLIC.SIGNUP} element={<Signup />} />
        </Route>
      </Route>

      {/* Usuario */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}>
        <Route
          element={
            <SuspenseLayout>
              <ClientLayout />
            </SuspenseLayout>
          }
        >
          <Route path={ROUTES.CLIENT.MAIN} element={<MainPage />} />
          <Route path={ROUTES.CLIENT.BOOK} element={<BookAppointment />} />
          <Route
            path={ROUTES.CLIENT.APPOINTMENTS}
            element={<MyAppointments />}
          />
          <Route path={ROUTES.CLIENT.PROFILE} element={<Profile />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route
          element={
            <SuspenseLayout>
              <AdminLayout />
            </SuspenseLayout>
          }
        >
          <Route
            path={ROUTES.ADMIN.CALENDAR}
            element={<AppointmentCalendar />}
          />
          <Route path={ROUTES.ADMIN.BOOK} element={<AdminBookAppointment />} />
          <Route path={ROUTES.ADMIN.EMPLOYEES} element={<Employees />} />
          <Route path={ROUTES.ADMIN.SERVICES} element={<Services />} />
          <Route path={ROUTES.ADMIN.COMPANY} element={<CompanyInfo />} />
          <Route path={ROUTES.ADMIN.SUSPENSIONS} element={<Suspensions />} />
          <Route path={ROUTES.ADMIN.REPORTS} element={<Reports />} />
        </Route>
      </Route>

      {/* Error */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      <Route path='*' element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
};

export default AppRoutes;
