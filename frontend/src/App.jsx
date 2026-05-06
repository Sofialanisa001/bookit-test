import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    // Rol del usuario
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;