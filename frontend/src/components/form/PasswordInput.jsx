// React
import { useState } from "react";

// MUI
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// Iconos
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordInput = ({ label = "Contraseña", ...props }) => {
  // <--------------- ESTADOS --------------->
  const [showPassword, setShowPassword] = useState(false);

  // <--------------- FUNCIONES --------------->
  // Funcion para cambiar entre ver/ocultar
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // <--------------- RENDER --------------->
  return (
    <TextField
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder='*********'
      variant='outlined'
      fullWidth
      InputLabelProps={{ shrink: true }}
      InputProps={{
        notched: false,
        endAdornment: (
          <InputAdornment position='end' sx={{ pr: 1.5 }}>
            <IconButton
              onClick={handleClickShowPassword}
              edge='end'
              sx={{ color: 'secondary.main' }}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      FormHelperTextProps={{
        sx: {
          color: 'error.main',
          fontSize: { xs: '12px', md: '14px' },
        },
      }}
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px',
          color: 'white',
          fontFamily: "'Montserrat', sans-serif",
          backgroundColor: 'rgba(255, 255, 255, 0.03)',

          '& fieldset': {
            borderColor: 'secondary.main',
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: 'secondary.light',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'secondary.main',
            borderWidth: '2px',
          },

          '& input::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
            opacity: 1,
          },
        },

        '& .MuiInputLabel-root': {
          color: 'primary.main',
          fontSize: '18px',
          fontWeight: '600',
          transform: 'translate(24px, 8px) scale(0.75)',
          transformOrigin: 'top left',
          '&.Mui-focused': {
            color: 'primary.main',
          },
        },

        '& .MuiInputBase-input': {
          fontSize: '16px',
          padding: '28px 24px 10px 24px',
        },
      }}
    />
  );
};

export default PasswordInput;