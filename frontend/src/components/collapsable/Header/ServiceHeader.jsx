// React
import React from 'react';

// MUI
import Box from '@mui/material/Box';

// Componentes propios
import Text from '@/components/common/Text';

const ServiceHeader = ({ service }) => {
  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        px: 1,
      }}
    >
      <Text children={service.nombre} color='white' size='22px' />
      <Text
        children={`$${Number(service.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`}
        color='primary.main'
        size='14px'
        fontWeight='bold'
      />
    </Box>
  );
};

export default ServiceHeader;