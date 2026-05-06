import React from 'react';

// MUI
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = ({ height = '100vh', bgcolor = 'background.default' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        backgroundColor: bgcolor,
      }}
    >
      <CircularProgress color='primary' />
    </Box>
  );
};

export default Loader;
