// React
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';

// Contexto
import { useAuth } from '@/context/AuthContext';

// API
import { getEmpresa } from '@/api/empresa.api';

// Constantes
import { ROUTES } from '@/constants/routes';

// MUI
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';

// ************** componentes propios :3 **************
// |  navigation
import NavOptions from '@/components/navigation/options/NavOptions';
import BaseDialog from '@/components/common/BaseDialog';

// ************** imagenes **************
import defaultLogo from '@/assets/logo/Logo1.webp';

// ************** iconos **************
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

function NavBar() {
  // <--------------- CONTEXTO --------------->
  const location = useLocation();
  const navigate = useNavigate();

  // <--------------- DERIVADO --------------->
  const currentPath = location.pathname;

  const { user, isAuthenticated, logout } = useAuth();

  const userName = user?.name || 'Usuario';
  const userEmail = user?.email || 'Correo';
  const isLogged = isAuthenticated;

  // <--------------- ESTADOS --------------->
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [logoEmpresa, setLogoEmpresa] = useState(null);

  // <--------------- EFFECTS --------------->
  // Obtener el logo de la empresa
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

  // <--------------- FUNCIONES --------------->
  // Funcion abre menu en cel
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // Funcion cierra menu en cel
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Funcion abre dialogo cerrar sesion
  const handleOpenSessionDialog = () => {
    setOpenSessionDialog(true);
  };

  // Funcion cierra dialogo cerrar sesion
  const handleCloseSessionDialog = (hasAccepted) => {
    setOpenSessionDialog(false);
    if (hasAccepted) {
      logout();
    }
  };

  // <--------------- RENDER --------------->
  return (
    <AppBar
      position='fixed'
      sx={{ background: (theme) => theme.customGradients.navbar }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {!isLogged ? (
            // Landing Page
            <>
              <Link component={RouterLink} to={ROUTES.PUBLIC.ROOT}>
                {logoEmpresa && (
                  <img
                    src={logoEmpresa}
                    alt='Logo'
                    style={{ margin: '5px', width: '35px', cursor: 'pointer' }}
                  />
                )}
              </Link>
            </>
          ) : (
            // Main Page
            <>
              <Link component={RouterLink} to={ROUTES.CLIENT.MAIN}>
                {logoEmpresa && (
                  <img
                    src={logoEmpresa}
                    alt='Logo'
                    style={{ margin: '5px', width: '35px', cursor: 'pointer' }}
                  />
                )}
              </Link>
            </>
          )}

          {/* ****** Display de las opciones *****  */}
          {/* C E L U L A R, T A B L E T S, E T C  */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
            >
              <MenuIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '.MuiMenu-paper': {
                  background: (theme) => theme.customGradients.menuMobile,
                },
                '.MuiMenuItem-root': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  py: 0.5,
                },
                '.MuiTypography-root, svg': {
                  fontSize: '0.6rem',
                  fontFamily: "'Montserrat', sans-serif",
                },
              }}
            >
              {!isLogged
                ? [
                    <MenuItem
                      key='login'
                      component={RouterLink}
                      to={ROUTES.PUBLIC.LOGIN}
                      onClick={handleCloseNavMenu}
                    >
                      <HowToRegIcon />
                      <Typography>Inicia sesión</Typography>
                    </MenuItem>,
                    <MenuItem
                      key='signup'
                      component={RouterLink}
                      to={ROUTES.PUBLIC.SIGNUP}
                      onClick={handleCloseNavMenu}
                    >
                      <PersonAddIcon />
                      <Typography>Regístrate</Typography>
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key='main'
                      component={RouterLink}
                      to={ROUTES.CLIENT.MAIN}
                      onClick={handleCloseNavMenu}
                      sx={{
                        color:
                          currentPath === ROUTES.CLIENT.MAIN
                            ? 'secondary.blueShade'
                            : 'inherit',
                      }}
                    >
                      <HomeIcon /> <Typography>Inicio</Typography>
                    </MenuItem>,
                    <MenuItem
                      key='book'
                      component={RouterLink}
                      to={ROUTES.CLIENT.BOOK}
                      onClick={handleCloseNavMenu}
                      sx={{
                        color:
                          currentPath === ROUTES.CLIENT.BOOK
                            ? 'secondary.blueShade'
                            : 'inherit',
                      }}
                    >
                      <EditCalendarIcon /> <Typography>Agendar cita</Typography>
                    </MenuItem>,
                    <MenuItem
                      key='schedule'
                      component={RouterLink}
                      to={ROUTES.CLIENT.APPOINTMENTS}
                      onClick={handleCloseNavMenu}
                      sx={{
                        color:
                          currentPath === ROUTES.CLIENT.APPOINTMENTS
                            ? 'secondary.blueShade'
                            : 'inherit',
                      }}
                    >
                      <CalendarIcon /> <Typography>Mis citas</Typography>
                    </MenuItem>,
                    <MenuItem
                      key='profile'
                      component={RouterLink}
                      to={ROUTES.CLIENT.PROFILE}
                      onClick={handleCloseNavMenu}
                      sx={{
                        color:
                          currentPath === ROUTES.CLIENT.PROFILE
                            ? 'secondary.blueShade'
                            : 'inherit',
                      }}
                    >
                      <UserIcon /> <Typography>Ver perfil</Typography>
                    </MenuItem>,
                  ]}
            </Menu>
          </Box>

          {/* LAPTOPS, MONITORES GRANDES, TELES xd */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'end',
            }}
          >
            {!isLogged ? (
              // Landing Page
              <>
                <NavOptions
                  icon={<HowToRegIcon />}
                  link={ROUTES.PUBLIC.LOGIN}
                  text='Inicia sesión'
                />
                <NavOptions
                  icon={<PersonAddIcon />}
                  link={ROUTES.PUBLIC.SIGNUP}
                  text='Regístrate'
                />
              </>
            ) : (
              // Main Page
              <>
                <NavOptions
                  icon={<HomeIcon />}
                  link={ROUTES.CLIENT.MAIN}
                  text='Inicio'
                  isActive={currentPath === ROUTES.CLIENT.MAIN}
                />
                <NavOptions
                  icon={<EditCalendarIcon />}
                  link={ROUTES.CLIENT.BOOK}
                  text='Agendar cita'
                  isActive={currentPath === ROUTES.CLIENT.BOOK}
                />
                <NavOptions
                  icon={<CalendarIcon />}
                  link={ROUTES.CLIENT.APPOINTMENTS}
                  text='Mis citas'
                  isActive={currentPath === ROUTES.CLIENT.APPOINTMENTS}
                />
                <NavOptions
                  icon={<UserIcon />}
                  link={ROUTES.CLIENT.PROFILE}
                  text='Ver perfil'
                  isActive={currentPath === ROUTES.CLIENT.PROFILE}
                />
              </>
            )}
          </Box>

          {/* Nombre y cerrar sesion */}
          {isLogged && (
            <>
              <Box
                sx={{
                  flexGrow: 0,
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  width: '180px',
                  px: 2,
                  overflow: 'hidden', 
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.8rem',
                    color: 'primary.main',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userName}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.6rem',
                    color: 'text.primary',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userEmail}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Button
                  onClick={handleOpenSessionDialog}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '0.6rem',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 'normal',
                    color: 'secondary.main',
                    transition: '0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'background.transparent',
                      color: 'secondary.blueShade',
                    },
                  }}
                >
                  <LogoutIcon /> Cerrar sesión
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>

      {/* Dialogo */}
      <BaseDialog
        id='close-admin-session'
        open={openSessionDialog}
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
    </AppBar>
  );
}
export default NavBar;
