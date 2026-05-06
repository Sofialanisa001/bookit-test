import React, { useState } from 'react';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';

// Contexto
import { useAuth } from '@/context/AuthContext';

// Constantes
import { ROUTES } from '@/constants/routes';

// MUI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Iconos
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

// Componentes
import BaseDialog from '@/components/common/BaseDialog';

// Logos
import logo from '@/assets/logo/Logo1.webp';

// Opciones
const menuItems = [
  {
    text: 'Calendario de citas',
    icon: <CalendarMonthIcon />,
    path: ROUTES.ADMIN.CALENDAR,
  },
  {
    text: 'Agendar cita',
    icon: <EditCalendarIcon />,
    path: ROUTES.ADMIN.BOOK,
  },
  {
    text: 'Gestión de empleados',
    icon: <PeopleIcon />,
    path: ROUTES.ADMIN.EMPLOYEES,
  },
  {
    text: 'Gestión de servicios',
    icon: <BuildIcon />,
    path: ROUTES.ADMIN.SERVICES,
  },
  {
    text: 'Información de la empresa',
    icon: <InfoIcon />,
    path: ROUTES.ADMIN.COMPANY,
  },
  {
    text: 'Suspensión de servicios',
    icon: <ReportProblemIcon />,
    path: ROUTES.ADMIN.SUSPENSIONS,
  },
  { text: 'Reportes', icon: <BarChartIcon />, path: ROUTES.ADMIN.REPORTS },
];

const Sidebar = ({ isExpanded = true, onClose }) => {
  // <--------------- CONTEXTO --------------->
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // <--------------- ESTADOS --------------->
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);

  // <--------------- FUNCIONES --------------->
  // Funcion abrir dialogo
  const handleOpenSessionDialog = () => {
    setIsSessionDialogOpen(true);
  };

  // Funcion cerrar dialogo
  const handleCloseSessionDialog = (hasAccepted) => {
    setIsSessionDialogOpen(false);

    if (hasAccepted) {
      logout();
    } else {
      if (onClose) {
        onClose();
      };
    }
  };

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '260px',
        background: (theme) => theme.customGradients.sidebar,
        color: 'white',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '64px',
          px: 2,
        }}
      >
        <img
          src={logo}
          alt='Logo'
          style={{
            height: '40px',
            width: '40px',
            minWidth: '40px',
            maxWidth: '40px',
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Opciones */}
      <List sx={{ flexGrow: 1, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: 'block', mb: 1 }}
          >
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={onClose}
              sx={{
                height: 'auto',
                py: 1.5,
                justifyContent: 'flex-start',
                px: 2.5,
                backgroundColor:
                  location.pathname === item.path
                    ? 'background.activeMenuItem'
                    : 'transparent',
                borderLeft: (theme) =>
                  location.pathname === item.path
                    ? `4px solid ${theme.palette.primary.light}`
                    : '4px solid transparent',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  color:
                    location.pathname === item.path
                      ? 'primary.light'
                      : 'text.primary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: isExpanded ? 1 : 0,
                  whiteSpace: 'normal',
                  width: '170px',
                  minWidth: '170px',
                  maxWidth: '170px',
                  flexShrink: 0,
                  transition: 'opacity 0.2s ease',
                  margin: 0,
                  '& .MuiTypography-root': {
                    fontSize: '0.9rem',
                    fontFamily: "'Montserrat', sans-serif",
                    lineHeight: 1.2,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Cerrar sesion */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleOpenSessionDialog}
          sx={{
            height: '48px',
            width: isExpanded ? '100%' : '48px',
            px: isExpanded ? 2.5 : 0,
            justifyContent: 'flex-start',
            borderRadius: isExpanded ? '24px' : '50%',
            backgroundColor: 'background.hoverLighter',
            '&:hover': { backgroundColor: 'background.hoverLight' },
            transition: 'all 0.3s ease',
            overflow: 'hidden',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isExpanded ? 0 : '48px',
              mr: isExpanded ? 3 : 0,
              justifyContent: 'center',
              color: 'white',
              transition: 'all 0.3s ease',
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary='Cerrar sesión'
            sx={{
              opacity: isExpanded ? 1 : 0,
              whiteSpace: 'normal',
              width: '170px',
              minWidth: '170px',
              maxWidth: '170px',
              flexShrink: 0,
              margin: 0,
              transition: 'opacity 0.2s ease',
              '& .MuiTypography-root': {
                fontSize: '0.9rem',
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: 1.2,
              },
            }}
          />
        </ListItemButton>
      </Box>

      {/* Dialogo */}
      <BaseDialog
        id='close-admin-session'
        open={isSessionDialogOpen}
        onClose={handleCloseSessionDialog}
        title={'Advertencia'}
        icon={<AdvertismentIcon />}
        content={
          <>
            {' '}
            Está a punto de cerrar sesión
            <br /> <b>¿Desea continuar?</b>
          </>
        }
      />
    </Box>
  );
};

export default Sidebar;
