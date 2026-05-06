// React
import React from 'react';

// MUI
import Box from '@mui/material/Box';

// Componentes propios
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';

const NotFound = () => {
  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column ',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        height: '100vh',
        gap: '5px',
      }}
    >
      <Title size={100} align='center'>
        404
      </Title>
      <Title align='center'>Página no encontrada</Title>
      <Box sx={{ mt: 10 }}>
        <Text align='center'>Lo sentimos, la ruta que buscas no existe.</Text>
      </Box>
    </Box>
  );
};

export default NotFound;
