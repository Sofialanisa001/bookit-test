import React, { useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// Componentes propios
import Text from '@/components/common/Text';

// Iconos
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const ServicesSection = ({
  availableServices,
  selectedServices,
  onServiceToggle,
  error,
}) => {
  // <--------------- ESTADOS --------------->
  const [selectedValue, setSelectedValue] = useState(
    availableServices[0] || '',
  );

  // <--------------- FUNCIONES --------------->

  // Funcion agregar servicio
  const handleAdd = () => {
    if (selectedValue && !selectedServices.includes(selectedValue)) {
      onServiceToggle(selectedValue);
    }
  };

  // <--------------- RENDER --------------->
  return (
    <Box
      id='field-servicios'
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {/* Seccion superior */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        {/* Titulo */}
        <Box sx={{ minWidth: 'max-content' }}>
          <Text
            children='Servicios que realiza'
            color='primary.light'
            size='18px'
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            gap: 2,
          }}
        >
          {/* Dropdown/Lista */}
          <Select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: 'background.serviceChip',
                  color: 'white',
                  '& .MuiMenuItem-root:hover': {
                    bgcolor: 'background.menuHover',
                  },
                  '& .Mui-selected': { bgcolor: 'background.menuSelected' },
                },
              },
            }}
            sx={{
              flexGrow: 1,
              bgcolor: 'background.serviceChip',
              color: 'white',
              borderRadius: '50px',
              height: '45px',
              fontFamily: "'Montserrat', sans-serif",
              '& fieldset': { border: 'none' },
              '& .MuiSvgIcon-root': { color: 'primary.light' },

              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: '20px',
                height: '100%',
              },
            }}
          >
            {availableServices.map((service) => (
              <MenuItem key={service} value={service}>
                {service}
              </MenuItem>
            ))}
          </Select>

          {/* Boton agregar servicio */}
          <IconButton
            onClick={handleAdd}
            disabled={selectedServices.includes(selectedValue)}
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              width: '45px',
              height: '45px',
              flexShrink: 0,
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': {
                bgcolor: 'background.menuSelected',
                color: 'rgba(0,0,0,0.4)',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Seccion de servicios seleccionados */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
        {selectedServices.map((service) => (
          // Contenedor servicio
          <Box
            key={service}
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            {/* Servicio */}
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: 'background.serviceChip',
                borderRadius: '50px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
              }}
            >
              <Text children={service} color='white' size='16px' />
            </Box>

            {/* Boton eliminar servicio */}
            <IconButton
              onClick={() => onServiceToggle(service)}
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                width: '45px',
                height: '45px',
                flexShrink: 0,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <CloseIcon sx={{ fontWeight: 'bold' }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Mensaje de Error */}
      {error && (
        <Text
          children={error}
          color='error.main'
          size='14px'
          sx={{ mt: 1 }}
          align='center'
        />
      )}
    </Box>
  );
};

export default ServicesSection;
