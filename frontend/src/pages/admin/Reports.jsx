import React, { useState, useEffect } from 'react';

// MUI
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// API
import {
  getReporteCitas,
  getReporteIngresos,
  getReporteServicios,
  getReporteProductividad,
} from '@/api/reportes.api';

// Utils
import { toastError } from '@/utils/notify';

// DAYJS
import dayjs from 'dayjs';

// Componentes propios
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';

// REPORTES
import AppointmentsReport from '@/components/reports/AppointmentsReport';
import IncomeReport from '@/components/reports/IncomeReport';
import ServicesReport from '@/components/reports/ServicesReport';
import ProductivityReport from '@/components/reports/ProductivityReport';

// <--------------- CONSTANTES --------------->

// Arregla bug de la libreria recharts
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('width(-1) and height(-1)')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

const mesesNombres = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const Reports = () => {
  // <--------------- CONTEXTO --------------->
  const mesActualIndex = dayjs().month();
  const anioActualNum = dayjs().year();

  // <--------------- DERIVADO --------------->
  const aniosList = Array.from({ length: 100 }, (_, i) =>
    (2000 + i).toString(),
  );

  // <--------------- ESTADOS --------------->
  const [activeTab, setActiveTab] = useState(0);
  const [mesFiltro, setMesFiltro] = useState(mesesNombres[mesActualIndex]);
  const [anioFiltro, setAnioFiltro] = useState(anioActualNum.toString());

  const [apiData, setApiData] = useState({ etiquetas: [], valores: [] });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    const fetchReportData = async () => {
      if (isFirstLoad) {
        setIsPageLoading(true);
        setServerError(false);
      } else {
        setIsReportLoading(true);
      }

      try {
        const mesInt = mesesNombres.indexOf(mesFiltro) + 1;
        let res;

        if (activeTab === 0) res = await getReporteCitas(mesInt, anioFiltro);
        else if (activeTab === 1)
          res = await getReporteIngresos(mesInt, anioFiltro);
        else if (activeTab === 2)
          res = await getReporteServicios(mesInt, anioFiltro);
        else if (activeTab === 3)
          res = await getReporteProductividad(mesInt, anioFiltro);

        if (res && res.ok) {
          setApiData({
            etiquetas: res.etiquetas || [],
            valores: res.valores || [],
          });
        } else {
          setApiData({ etiquetas: [], valores: [] });
        }
      } catch (error) {
        setApiData({ etiquetas: [], valores: [] });
        const msg =
          typeof error === 'string'
            ? error
            : 'Ocurrió un error al obtener el reporte.';

        if (msg === 'No hay conexión con el servidor.') {
          if (isFirstLoad) {
            setServerError(true);
          } else {
            toastError(
              'Se perdió la conexión con el servidor.',
              'report-conn-error',
            );
          }
        } else {
          toastError(msg, 'report-fetch-error');
        }
      } finally {
        if (isFirstLoad) {
          setIsPageLoading(false);
          setIsFirstLoad(false);
        } else {
          setIsReportLoading(false);
        }
      }
    };

    fetchReportData();
  }, [activeTab, mesFiltro, anioFiltro, refreshTrigger]);

  // <--------------- CONFIG DE UI --------------->
  const tabs = [
    'Citas por período',
    'Ingresos por período',
    'Servicios más solicitados',
    'Productividad',
  ];

  const selectMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: 'background.serviceChip',
        color: 'white',
        '& .MuiMenuItem-root:hover': {
          backgroundColor: 'rgba(255, 183, 77, 0.2)',
        },
        '& .Mui-selected': {
          backgroundColor: 'rgba(255, 183, 77, 0.4) !important',
        },
      },
    },
  };

  const selectEstilos = {
    backgroundColor: 'background.serviceChip',
    color: 'white',
    borderRadius: '50px',
    height: '40px',
    px: 1,
    '& fieldset': { border: 'none' },
    '& .MuiSvgIcon-root': { color: 'primary.light' },
  };

  // <--------------- RENDER --------------->
  if (isPageLoading) return <Loader height='100%' />;

  if (serverError) {
    return (
      <ErrorScreen
        onRetry={() => {
          setIsFirstLoad(true);
          setIsPageLoading(true);
          setServerError(false);
          setRefreshTrigger((prev) => prev + 1);
        }}
        offsetMobile='64px'
        offsetDesktop='80px'
      />
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '1000px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Title
        children='REPORTES'
        size={{ xs: '2rem', md: '3rem' }}
        color='white'
        align='left'
      />

      {/* Navegacion de reportes */}
      <Box
        sx={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: '0px' },
        }}
      >
        {tabs.map((tab, index) => (
          <Box
            key={index}
            onClick={() => setActiveTab(index)}
            sx={{
              py: 2,
              px: { xs: 2, md: 3 },
              cursor: 'pointer',
              borderBottom: (theme) =>
                activeTab === index
                  ? `3px solid ${theme.palette.primary.light}`
                  : '3px solid transparent',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Text
              children={tab}
              color={activeTab === index ? 'white' : 'rgba(255,255,255,0.5)'}
              size={16}
              fontWeight={activeTab === index ? 'bold' : 'normal'}
            />
          </Box>
        ))}
      </Box>

      {/* Mes y año */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'center' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Text children='Selecciona un mes' color='primary.light' size={20} />
          <Select
            value={mesFiltro}
            onChange={(e) => setMesFiltro(e.target.value)}
            MenuProps={selectMenuProps}
            sx={{ ...selectEstilos, minWidth: '140px' }}
          >
            {mesesNombres.map((mes) => (
              <MenuItem key={mes} value={mes}>
                {mes}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Text children='Selecciona un año' color='primary.light' size={20} />
          <Select
            value={anioFiltro}
            onChange={(e) => setAnioFiltro(e.target.value)}
            MenuProps={selectMenuProps}
            sx={{ ...selectEstilos, minWidth: '110px' }}
          >
            {aniosList.map((anio) => (
              <MenuItem key={anio} value={anio}>
                {anio}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Reportes */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isReportLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Loader height='20vh' />
          </Box>
        ) : apiData.etiquetas.length === 0 ||
          apiData.valores.reduce((a, b) => a + b, 0) === 0 ? (
          <Box
            sx={{
              p: 5,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text
              children='No hay datos para mostrar en este período.'
              color='text.primary'
              align='center'
              size={{ xs: 18, md: 20 }}
              fontWeight='bold'
            />
            <Box sx={{ mt: 1 }}>
              <Text
                children='Intenta seleccionando un mes o año diferente.'
                color='text.secondary'
                align='center'
                size={{ xs: 14, md: 16 }}
              />
            </Box>
          </Box>
        ) : (
          <>
            {activeTab === 0 && <AppointmentsReport apiData={apiData} />}
            {activeTab === 1 && <IncomeReport apiData={apiData} />}
            {activeTab === 2 && <ServicesReport apiData={apiData} />}
            {activeTab === 3 && <ProductivityReport apiData={apiData} />}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Reports;
