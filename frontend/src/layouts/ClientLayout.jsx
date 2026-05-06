import { Outlet } from 'react-router-dom';

// MUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

// Componentes
import NavBar from '@/components/navigation/NavBar';

const ClientLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Navegacion */}
      <NavBar />

      {/* Espaciador para compensar el espacio del navbar fijo */}
      <Toolbar />

      {/* Contenido */}
      <Box
        component='main'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ClientLayout;
