import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// API
import { getEmpresa } from '@/api/empresa.api';

// MUI
import Box from '@mui/material/Box';

// Assets
import img from '@/assets/auth/bg_auth.webp';
import defaultLogo from '@/assets/logo/Logo1.webp';

const AuthLayout = () => {
  // <--------------- ESTADOS --------------->
  const [logoEmpresa, setLogoEmpresa] = useState(null);

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const data = await getEmpresa();
        if (data.empresa?.logo?.url) {
          setLogoEmpresa(data.empresa.logo.url);
        } else {
          setLogoEmpresa(defaultLogo);
        }
      } catch (error) {
        setLogoEmpresa(defaultLogo);
      }
    };

    fetchLogo();
  }, []);

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backgroundBlendMode: 'darken',
        p: { xs: 2, md: 4 },
        boxSizing: 'border-box',
      }}
    >
      {/* Logo */}
      {logoEmpresa && (
        <Box
          component='img'
          src={logoEmpresa}
          alt='Logo de la empresa'
          sx={{
            position: 'absolute',
            top: { xs: 20, md: 40 },
            right: { xs: 20, md: 60 },
            width: { xs: '80px', md: '120px' },
            height: 'auto',
            zIndex: 10,
            display: { xs: 'none', md: 'block' },
          }}
        />
      )}

      {/* Contenido */}
      <Box
        sx={{
          gridColumn: { xs: '1', md: '2 / span 5', lg: '2 / span 4' },
          zIndex: 5,
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '450px',
            margin: 'auto 0',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
