import React, { useMemo } from 'react';

// MUI
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// CHARTS
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

// Componentes propios
import Text from '@/components/common/Text';

// <--------------- COMPONENTES AUXILIARES --------------->

// El cuadrito de cada barrita
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.serviceChip',
          border: (theme) => theme.palette.customBorders.section,
          borderRadius: '8px',
          p: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
      >
        <Text
          children={`${label}`}
          color='white'
          size={14}
          fontWeight='bold'
          sx={{ mb: 0.5 }}
        />
        <Text
          children={`Solicitudes : ${payload[0].value}`}
          color='primary.light'
          size={14}
        />
      </Box>
    );
  }
  return null;
};

const ServicesReport = ({ apiData }) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // <--------------- MEMO --------------->

  // Genera los datos de la grafica segun el mes y año
  const dataDinamica = useMemo(() => {
    if (!apiData || !apiData.etiquetas) return [];

    const datos = apiData.etiquetas.map((etiqueta, index) => ({
      servicio: etiqueta,
      solicitudes: apiData.valores[index] || 0,
      color:
        theme.customCharts.barMixed[index % theme.customCharts.barMixed.length],
    }));

    // Se ordena de mayor a menor
    return datos.sort((a, b) => b.solicitudes - a.solicitudes);
  }, [apiData, theme]);

  // Genera los numeros de la izq blanco
  const dynamicTicks = useMemo(() => {
    const maxSolicitudes = Math.max(
      ...dataDinamica.map((d) => d.solicitudes),
      10,
    );
    let step = maxSolicitudes / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(step || 1)));
    step = Math.ceil(step / magnitude) * magnitude;
    return [0, step, step * 2, step * 3, step * 4, step * 5];
  }, [dataDinamica]);

  // <--------------- DERVIADO --------------->
  const chartHeightValue = isMobile ? 320 : 380;
  const leftColWidth = isMobile ? 45 : 65;
  const chartWidthValue = dataDinamica.length * (isMobile ? 55 : 80);

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        pl: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Text
          children='Servicios más demandados'
          color='white'
          size={{ xs: 20, md: 24 }}
          align='center'
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          position: 'relative',
          display: 'flex',
          height: `${chartHeightValue}px`,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${leftColWidth}px`,
            flexShrink: 0,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '-80px', md: '-90px' },
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              transformOrigin: 'center',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            <Text
              children='Cantidad de solicitudes'
              color='white'
              size={{ xs: 12, md: 14 }}
              fontWeight='bold'
            />
          </Box>

          <Box
            sx={{
              height: '100%',
              width: '100%',
              '& .recharts-wrapper, & .recharts-surface, & *:focus': {
                outline: 'none !important',
              },
            }}
          >
            <BarChart
              width={leftColWidth}
              height={chartHeightValue}
              data={dataDinamica}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <Bar dataKey='solicitudes' fill='transparent' />
              <YAxis
                width={leftColWidth}
                tick={{ fill: 'white', fontSize: isMobile ? 12 : 14 }}
                axisLine={false}
                tickLine={false}
                domain={[0, dynamicTicks[dynamicTicks.length - 1]]}
                ticks={dynamicTicks}
              />
            </BarChart>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar:vertical': { display: 'none', width: 0 },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: (theme) => theme.palette.primary.light,
              borderRadius: '10px',
            },
            pb: 1,
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: dataDinamica.length > 5 ? `${chartWidthValue}px` : '100%',
              '& .recharts-wrapper, & .recharts-surface, & *:focus': {
                outline: 'none !important',
              },
            }}
          >
            {dataDinamica.length > 5 ? (
              <BarChart
                data={dataDinamica}
                width={chartWidthValue}
                height={chartHeightValue}
                margin={{
                  top: 20,
                  right: isMobile ? 10 : 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='rgba(255,255,255,0.1)'
                />

                <XAxis
                  dataKey='servicio'
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  hide={true}
                  width={0}
                  domain={[0, dynamicTicks[dynamicTicks.length - 1]]}
                  ticks={dynamicTicks}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />

                <Bar
                  dataKey='solicitudes'
                  radius={[8, 8, 0, 0]}
                  maxBarSize={80}
                >
                  <LabelList
                    dataKey='solicitudes'
                    position='top'
                    fill='white'
                    fontSize={isMobile ? 14 : 16}
                    fontWeight='bold'
                  />
                  {dataDinamica.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <ResponsiveContainer
                width='100%'
                height='100%'
                minWidth={1}
                minHeight={1}
              >
                <BarChart
                  data={dataDinamica}
                  margin={{
                    top: 20,
                    right: isMobile ? 10 : 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='rgba(255,255,255,0.1)'
                  />

                  <XAxis
                    dataKey='servicio'
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    hide={true}
                    width={0}
                    domain={[0, dynamicTicks[dynamicTicks.length - 1]]}
                    ticks={dynamicTicks}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />

                  <Bar
                    dataKey='solicitudes'
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
                  >
                    <LabelList
                      dataKey='solicitudes'
                      position='top'
                      fill='white'
                      fontSize={isMobile ? 14 : 16}
                      fontWeight='bold'
                    />
                    {dataDinamica.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Text
          children='Servicios'
          color='white'
          size={{ xs: 12, md: 14 }}
          fontWeight='bold'
        />
      </Box>
    </Box>
  );
};

export default ServicesReport;
