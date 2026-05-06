// React
import { useState, useEffect } from 'react';

// Contexto
import { useAuth } from '@/context/AuthContext';

// API
import { getEmpresa } from '@/api/empresa.api';
import { getServicios } from '@/api/servicios.api';

// Constantes
import { ROUTES } from '@/constants/routes';

// MUI
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// ************** componentes propios :3 **************
// |  common
import MainButton from '@/components/common/MainButton';
import TextWIcon from '@/components/common/TextWIcon';
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';
// |  main
import CardServices from '@/components/main/CardServices';
// ************** iconos **************
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import LocationIcon from '@mui/icons-material/LocationOnRounded';
import PhoneIcon from '@mui/icons-material/PhoneRounded';
import EmailIcon from '@mui/icons-material/EmailRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// ************** media dummy **************
// |  Imagenes
import carruselPhoto from '@/assets/dummy/main-2.webp';
import mainPhoto from '@/assets/dummy/main-1.webp';
import servicePhoto from '@/assets/dummy/service.webp';


function MainPage() {
  // <--------------- CONTEXTO --------------->
  const { isAuthenticated } = useAuth();

  // <--------------- ESTADOS --------------->
  const [empresa, setEmpresa] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // <--------------- EFFECTS --------------->
  const fetchLandingData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      // Se hacen ambas peticiones al mismo tiempo
      const [empresaData, serviciosData] = await Promise.all([
        getEmpresa(),
        getServicios(),
      ]);

      setEmpresa(empresaData.empresa);

      // Filtramos para mostrar solo los servicios activos
      const serviciosActivos = serviciosData.servicios.filter(
        (s) => s.activo !== false,
      );
      setServicios(serviciosActivos);
    } catch (error) {
      // Si falla CUALQUIERA de las dos (ej. no hay internet o servidor caído), cae aquí
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLandingData();
  }, []);

  // <--------------- RENDER --------------->

  // La pantalla de carga
  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loader height='auto' />
      </Box>
    );
  }

  // Si no hay conexion
  if (hasError) {
    return (
      <ErrorScreen
        onRetry={fetchLandingData}
        offsetMobile='64px'
        offsetDesktop='64px'
      />
    );
  }

  return (
    <>
      {/* Slider principal de las imagenes -> está en modo automatico 🦭 */}
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 50,
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            zIndex: 100,
            top: '70%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Empresa */}
          <Title
            children={empresa?.nombre || 'Bienvenido'}
            align='center'
            color='text.primary'
          />

          {/* Slogan */}
          <Text
            children={empresa?.slogan || ''}
            align='center'
            color='primary.main'
            size='20'
          />
        </Box>

        <Swiper
          modules={[Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={1500}
          effect='fade'
          loop={true}
        >
          {empresa?.galeria && empresa.galeria.length > 0 ? (
            empresa.galeria.map((foto) => (
              // Pone las img del carrusel
              <SwiperSlide key={foto._id}>
                <Box
                  component='img'
                  src={foto.url}
                  alt={`Imagen de la empresa`}
                  sx={{
                    height: '400px',
                    width: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </SwiperSlide>
            ))
          ) : (
            // Si no se encuentra, se pone una foto default
            <SwiperSlide>
              <Box
                component='img'
                src={carruselPhoto}
                alt='Imagen de respaldo del carrusel'
                sx={{
                  height: '400px',
                  width: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </Box>

      {/* Info central */}
      <Box
        sx={{
          background: (theme) => theme.customGradients.mainBackground,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          py: { xs: 0, md: 2 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 5, md: 4, lg: 10 }}
          sx={{
            p: { xs: 5, md: 6, lg: 10 },
            maxWidth: '1300px',
            width: '100%',
          }}
        >
          {/* Imagen */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component='img'
              src={empresa?.imagenPrincipal?.url || mainPhoto}
              sx={{
                width: '100%',
                maxWidth: { xs: '250px', md: '100%' },
                height: 'auto',
              }}
            />
          </Grid>

          {/* Descripcion */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
            }}
          >
            <Text
              align='justify'
              color='text.primary'
              size='16'
              children={
                empresa?.descripcion ||
                'No hay descripción disponible en este momento.'
              }
            />
          </Grid>
        </Grid>
      </Box>

      {/* Swiper de los servicios */}
      <Box
        sx={{
          width: '100%',
          background: (theme) => theme.customGradients.mainBackground,
          display: 'flex',
          justifyContent: 'center',
          py: { xs: 6, md: 6 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1300px',
            px: { xs: 6, md: 8, lg: 12 },
            position: 'relative',
            '.swiper': {
              position: 'static',
            },
            '.swiper-button-next, .swiper-button-prev': {
              color: 'text.secondary',
              transition: '0.2s ease-in-out',
              '&:hover': { color: 'text.primary', transform: 'scale(1.1)' },
            },
            '.swiper-button-prev': {
              left: { xs: '5px', md: '10px', lg: '20px' },
            },
            '.swiper-button-next': {
              right: { xs: '5px', md: '10px', lg: '20px' },
            },
          }}
        >
          <Swiper
            modules={[Navigation]}
            spaceBetween={0}
            navigation={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
            }}
          >
            {servicios.map((item) => (
              <SwiperSlide key={item._id}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CardServices
                    image={item.foto?.url || servicePhoto}
                    name={item.nombre}
                    description={item.descripcion}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>

      {/* Botón para agendar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 5,
          background: (theme) => theme.customGradients.mainBackground,
          width: '100%',
        }}
      >
        {!isAuthenticated ? (
          // Landing Page
          <>
            <MainButton to={ROUTES.PUBLIC.LOGIN}>
              Agenda tu cita <CalendarIcon />
            </MainButton>
          </>
        ) : (
          // Main Page
          <>
            <MainButton to={ROUTES.CLIENT.BOOK}>
              Agenda tu cita <CalendarIcon />
            </MainButton>
          </>
        )}
      </Box>

      {/* ****** footer *****  */}
      <Box
        sx={{
          background: (theme) => theme.customGradients.navbar,
          p: 3,
          mt: 'auto',
          width: '100%',
        }}
      >
        <Box sx={{ ml: 1, mb: 1.2 }}>
          <Title children='Contáctanos' color='text.primary' size='18' />
        </Box>
        <Grid
          container
          spacing={{ xs: 0, md: 10 }}
          sx={{ justifyContent: 'center' }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Direccion */}
            <TextWIcon
              icon={<LocationIcon sx={{ color: 'secondary.main', p: 0.3 }} />}
              text={
                `Dirección: ${empresa?.direccion}` || 'Dirección no disponible'
              }
            />
            {/* Telefono */}
            <TextWIcon
              icon={<PhoneIcon sx={{ color: 'secondary.main', p: 0.3 }} />}
              text={
                `Teléfono: +${empresa?.telefono}` || 'Teléfono no disponible'
              }
            />
            {/* Correo */}
            <TextWIcon
              icon={<EmailIcon sx={{ color: 'secondary.main', p: 0.3 }} />}
              text={
                `Correo electrónico: ${empresa?.correo}` ||
                'Correo electrónico no disponible'
              }
            />
          </Grid>
          {/* Horario */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextWIcon
              icon={<CalendarIcon sx={{ color: 'secondary.main', p: 0.3 }} />}
              text='Horario de atención:'
            />
            <Box sx={{ px: 4, pl: 5 }}>
              {empresa?.horarioGlobal?.length > 0 ? (
                empresa.horarioGlobal.map((horario, index) => {
                  const diaCapitalizado =
                    horario.dia.charAt(0).toUpperCase() + horario.dia.slice(1);

                  return (
                    <Text
                      key={index}
                      align='justify'
                      color='text.secondary'
                      size='14'
                      children={`${diaCapitalizado}: ${horario.horaInicio} a ${horario.horaFin}`}
                    />
                  );
                })
              ) : (
                <Text
                  align='justify'
                  color='text.secondary'
                  size='14'
                  children='Horario no disponible'
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default MainPage;
