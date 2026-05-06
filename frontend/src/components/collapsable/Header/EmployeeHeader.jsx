// MUI
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

// Componentes propios
import Text from '@/components/common/Text';

const EmployeeHeader = ({ employee }) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        width: '100%',
        flexGrow: 1,
        boxSizing: 'border-box',
        pl: { xs: 0.5, md: 1 },
        pr: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, md: 2 },
          flexGrow: 1,
          minWidth: 0,
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        {/* Foto del empleado */}
        <Avatar
          src={employee.foto?.url}
          sx={{
            width: { xs: 45, md: 60 },
            height: { xs: 45, md: 60 },
            flexShrink: 0,
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            minWidth: 0,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Nombre */}
          <Box
            sx={{
              width: '100%',
              display: 'block',
              wordBreak: 'break-word',
              '& > *': {
                wordBreak: 'break-word',
                display: 'block',
              },
            }}
          >
            <Text
              children={employee.nombre}
              color='white'
              size={{ xs: '16px', md: '22px' }}
            />
          </Box>

          {/* Correo */}
          <Box
            sx={{
              width: '100%',
              display: 'block',
              wordBreak: 'break-all',
              '& > *': {
                wordBreak: 'break-all',
                display: 'block',
              },
            }}
          >
            <Text
              children={employee.correo}
              color='primary.main'
              size={{ xs: '12px', md: '14px' }}
              fontWeight='bold'
            />
          </Box>

          {/* Estado cel */}
          <Box
            sx={{
              backgroundColor: employee.activo
                ? theme.palette.background.statusActive
                : theme.palette.background.statusInactive,
              border: employee.activo
                ? theme.palette.customBorders.statusActive
                : theme.palette.customBorders.statusInactive,
              borderRadius: '50px',
              px: 1.5,
              py: 0.2,
              mt: 0.5,
              display: { xs: 'inline-flex', md: 'none' },
              alignItems: 'center',
              justifyContent: 'center',
              width: 'max-content',
            }}
          >
            <Text
              children={employee.activo ? 'Activo' : 'Inactivo'}
              color={employee.activo ? 'success.main' : 'error.main'}
              size='10px'
              fontWeight='bold'
            />
          </Box>
        </Box>
      </Box>

      {/* Estado PC */}
      <Box
        sx={{
          backgroundColor: employee.activo
            ? theme.palette.background.statusActive
            : theme.palette.background.statusInactive,
          border: employee.activo
            ? theme.palette.customBorders.statusActive
            : theme.palette.customBorders.statusInactive,
          borderRadius: '50px',
          px: 2,
          py: 0.5,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ml: 2,
        }}
      >
        <Text
          children={employee.activo ? 'Activo' : 'Inactivo'}
          color={employee.activo ? 'success.main' : 'error.main'}
          size='12px'
          fontWeight='bold'
        />
      </Box>
    </Box>
  );
};

export default EmployeeHeader;
