import React, { useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// Iconos
import CloseIcon from '@mui/icons-material/Close';
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

// Componentes propios
import Text from '@/components/common/Text';
import BaseDialog from '@/components/common/BaseDialog';
import Loader from '@/components/common/Loader'; 

// <--------------- CONSTANTES --------------->
const meses = [
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

const anios = Array.from({ length: 100 }, (_, i) => 2000 + i);

const SuspensionList = ({
  mesFiltro,
  setMesFiltro,
  anioFiltro,
  setAnioFiltro,
  listaSuspensiones,
  isListLoading,
  handleEliminarSuspension,
  selectMenuProps,
  selectEstilos,
}) => {
  // <--------------- ESTADOS --------------->
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [actualSuspenction, setActualSuspenction] = useState(
    listaSuspensiones[0] || '',
  );
  const [suspenctionName, setSuspectionName] = useState('');

  // <--------------- FUNCIONES --------------->

  // Abrir dialogo
  const handleOpenDeleteDialog = (index, texto) => {
    setOpenDeleteDialog(true);
    setActualSuspenction(index);
    setSuspectionName(texto);
  };

  // Cerrar dialogo
  const handleCloseDeleteDialog = (hasAccepted) => {
    setOpenDeleteDialog(false);
    if (hasAccepted) {
      handleEliminarSuspension(actualSuspenction);
    }
  };

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        border: (theme) => theme.palette.customBorders.section,
        borderRadius: '16px',
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Seccion superior */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Text
          children='Lista de horarios suspendidos:'
          color='primary.light'
          size='22px'
        />

        {/* Opciones mes y año */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          {/* Mes */}
          <Select
            value={mesFiltro}
            onChange={(e) => setMesFiltro(e.target.value)}
            MenuProps={selectMenuProps}
            sx={{
              ...selectEstilos,
              flex: 1,
              minWidth: { md: '140px' },
            }}
          >
            {meses.map((mes) => (
              <MenuItem key={mes} value={mes}>
                {mes}
              </MenuItem>
            ))}
          </Select>

          {/* Año */}
          <Select
            value={anioFiltro}
            onChange={(e) => setAnioFiltro(e.target.value)}
            MenuProps={selectMenuProps}
            sx={{
              ...selectEstilos,
              flex: 1,
              minWidth: { md: '100px' },
            }}
          >
            {anios.map((anio) => (
              <MenuItem key={anio} value={anio}>
                {anio}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Lista de suspensiones */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isListLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Loader height='auto' />
          </Box>
        ) : listaSuspensiones.length === 0 ? (
          <Text
            children='No hay suspensiones registradas en este periodo.'
            color='text.disabled'
            align='center'
          />
        ) : (
          listaSuspensiones.map((susp) => (
            <Box
              key={susp.id}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  backgroundColor: 'background.serviceChip',
                  borderRadius: '50px',
                  px: { xs: 2, md: 3 },
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Text children={susp.texto} color='white' size='16px' />
              </Box>

              <IconButton
                onClick={() => handleOpenDeleteDialog(susp.id, susp.texto)}
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  width: { xs: '40px', md: '45px' },
                  height: { xs: '40px', md: '45px' },
                  flexShrink: 0,
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                <CloseIcon sx={{ fontWeight: 'bold' }} />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      {/* Dialogo */}
      <BaseDialog
        id='delete-suspension'
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title={'Advertencia'}
        fontSizeContent={18}
        icon={<AdvertismentIcon />}
        content={
          <>
            {' '}
            Está a punto de eliminar la suspensión del día: <br />{' '}
            <b>{suspenctionName}</b> <br />
            ¿Desea continuar?
          </>
        }
      />
    </Box>
  );
};

export default SuspensionList;
