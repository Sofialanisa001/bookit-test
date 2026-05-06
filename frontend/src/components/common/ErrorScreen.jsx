import React from 'react';

// MUI
import Box from '@mui/material/Box';

// Componentes Propios
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import MainButton from '@/components/common/MainButton';

// Icono
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorScreen = ({
  onRetry,
  title = '¡Ups! Hubo un problema de conexión',
  message = 'No pudimos cargar la información. Por favor, verifica tu conexión a internet o intenta más tarde.',
  offsetMobile = '0px',
  offsetDesktop = '0px',
}) => {
  return (
    <Box
      sx={{
        height: {
          xs: `calc(100vh - ${offsetMobile})`,
          md: `calc(100vh - ${offsetDesktop})`,
        },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
        gap: 3,
        p: 3,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.disabled' }} />

      <Title children={title} color='white' align='center' />

      <Box sx={{ maxWidth: '500px' }}>
        <Text children={message} color='text.secondary' align='center' />
      </Box>

      {onRetry && (
        <Box sx={{ mt: 2 }}>
          <MainButton onClick={onRetry}>Reintentar</MainButton>
        </Box>
      )}
    </Box>
  );
};

export default ErrorScreen;