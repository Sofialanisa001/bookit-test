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

// Formatea el precio
const formatNumber = (num) => {
  return num.toLocaleString('es-US');
};

// El cuadrito de cada barrita
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

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
          children={`Semana ${data.numeroSemana}: ${label}`}
          color='white'
          size={14}
          fontWeight='bold'
          sx={{ mb: 0.5 }}
        />
        <Text
          children={`Ingresos : $${formatNumber(payload[0].value)}`}
          color='primary.light'
          size={14}
        />
      </Box>
    );
  }
  return null;
};

const IncomeReport = ({ apiData }) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // <--------------- MEMO --------------->

  // Genera los datos de la grafica segun el mes y año
  const dataDinamica = useMemo(() => {
    if (!apiData || !apiData.etiquetas) return [];

    return apiData.etiquetas.map((etiqueta, index) => ({
      semana: etiqueta,
      numeroSemana: index + 1,
      ingresos: apiData.valores[index] || 0,
      color:
        theme.customCharts.barGradient[
          index % theme.customCharts.barGradient.length
        ],
    }));
  }, [apiData, theme]);

  // Genera los numeros de la izq blanco
  const dynamicTicks = useMemo(() => {
    const maxIngresos = Math.max(...dataDinamica.map((d) => d.ingresos), 1000);
    let step = maxIngresos / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
    step = Math.ceil(step / magnitude) * magnitude;
    return [0, step, step * 2, step * 3, step * 4, step * 5];
  }, [dataDinamica]);

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: '380px', md: '450px' },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        pl: { xs: 2, sm: 3, md: 5 },
      }}
    >
      {/* Titulos de la grafica */}
      <Box sx={{ textAlign: 'center' }}>
        <Text
          children='Ingresos semanales'
          color='white'
          size={{ xs: 20, md: 24 }}
          align='center'
        />
        <Text
          children='Cantidad de ingresos por semana'
          color='white'
          size={{ xs: 14, md: 16 }}
          align='center'
          fontWeight='bold'
        />
      </Box>

      {/* Contenedor de la grafica y etiquetas */}
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Etiqueta izq (Y) */}
        <Box
          sx={{
            position: 'absolute',
            left: { xs: '-70px', sm: '-70px', md: '-90px' },
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'center',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          <Text
            children='Cantidad de ingresos'
            color='white'
            size={{ xs: 12, md: 14 }}
            fontWeight='bold'
          />
        </Box>

        {/* Grafica */}
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0,
            width: '100%',
            height: '100%',
            '& .recharts-wrapper, & .recharts-surface, & *:focus': {
              outline: 'none !important',
            },
          }}
        >
          <ResponsiveContainer width='100%' height='100%' minHeight={100}>
            <BarChart
              data={dataDinamica}
              margin={{
                top: 20,
                right: isMobile ? 10 : 30,
                left: 15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke='rgba(255,255,255,0.1)'
              />

              <XAxis
                dataKey='semana'
                tick={{ fill: 'white', fontSize: isMobile ? 12 : 14 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />

              <YAxis
                tick={{ fill: 'white', fontSize: isMobile ? 12 : 14 }}
                axisLine={false}
                tickLine={false}
                domain={[0, dynamicTicks[dynamicTicks.length - 1]]}
                ticks={dynamicTicks}
                tickFormatter={formatNumber}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />

              <Bar dataKey='ingresos' radius={[8, 8, 0, 0]} maxBarSize={80}>
                <LabelList
                  dataKey='ingresos'
                  position='top'
                  fill='white'
                  fontSize={isMobile ? 14 : 16}
                  fontWeight='bold'
                  formatter={formatNumber}
                />

                {dataDinamica.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Etiqueta abajo (X) */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: isMobile ? 2 : 3,
          }}
        >
          <Text
            children='Semanas del mes'
            color='white'
            size={{ xs: 12, md: 14 }}
            fontWeight='bold'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default IncomeReport;
