// React
import { useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';

// Iconos
import Man from '@mui/icons-material/Man';
import Woman from '@mui/icons-material/Woman';

const GenderSelect = ({
  id,
  label = 'Sexo',
  background,
  border,
  height = { xs: '60px', md: '80px' },
  value,
  onChange,
  helperText,
  disabled = false,
}) => {
  // <--------------- RENDER --------------->
  return (
    <Box id={id} sx={{ width: '100%' }}>
      <Box
        sx={{
          border: (theme) => {
            if (disabled) return '2px solid rgba(255, 255, 255, 0.3)';

            if (border) {
              return typeof border === 'function'
                ? border(theme)
                : `2px solid ${theme.palette[border.split('.')[0]][border.split('.')[1]] || border}`;
            }

            return `2px solid ${theme.palette.secondary.main}`;
          },
          borderRadius: '30px',
          padding: '4px 12px',
          position: 'relative',
          height: height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: disabled
            ? 'background.default'
            : background || 'background.paper',
          boxSizing: 'border-box',
          opacity: disabled ? 0.7 : 1,
          '&:hover': {
            borderColor: 'secondary.blueShade',
          },
        }}
      >
        <Typography
          sx={{
            color: disabled ? 'primary.dark' : 'primary.main',
            fontWeight: 'bold',
            fontSize: { xs: '12px', md: '14px' },
            position: 'absolute',
            top: { xs: 4, md: 8 },
            left: { xs: 16, md: 20 },
          }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 0.5, md: 1.5 },
            mt: { xs: 2, md: 1.5 },
          }}
        >
          <IconButton
            onClick={() => !disabled && onChange('M')}
            disableRipple={disabled}
            sx={{
              color:
                value === 'M' ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
              backgroundColor:
                value === 'M'
                  ? 'rgba(255, 157, 64, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: { xs: '4px', md: '6px' },
              cursor: disabled ? 'default' : 'pointer',
              '&:hover': {
                backgroundColor: disabled
                  ? value === 'M'
                    ? 'rgba(255, 157, 64, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Man
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'inherit',
              }}
            />
          </IconButton>

          <IconButton
            onClick={() => !disabled && onChange('F')}
            disableRipple={disabled}
            sx={{
              color:
                value === 'F' ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
              backgroundColor:
                value === 'F'
                  ? 'rgba(255, 157, 64, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: { xs: '4px', md: '6px' },
              cursor: disabled ? 'default' : 'pointer',
              '&:hover': {
                backgroundColor: disabled
                  ? value === 'F'
                    ? 'rgba(255, 157, 64, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Woman
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'inherit',
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {helperText && (
        <FormHelperText
          sx={{
            color: 'error.main',
            mx: 2,
            fontSize: { xs: '12px', md: '14px' },
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default GenderSelect;
