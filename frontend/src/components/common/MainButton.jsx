import { Link as RouterLink } from 'react-router-dom';

// MUI
import Button from '@mui/material/Button';

const MainButton = ({
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  size = 18,
  sx,
  to,
  ...props
}) => {
  // <--------------- VALORES --------------->
  const responsiveFontSize =
    typeof size === 'object'
      ? { ...size }
      : {
          xs: `${Number(size) * 0.7}px`,
          sm: `${Number(size) * 0.85}px`,
          md: `${size}px`,
        };

  // <--------------- RENDER --------------->
  return (
    <Button
      type={type}
      variant='contained'
      fullWidth={fullWidth}
      onClick={onClick}
      component={to ? RouterLink : undefined} 
      to={to}
      {...props}
      sx={[
        {
          borderRadius: '50px',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          width: 'fit-content',
          margin: 'auto',
          padding: '10px 32px',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 'bold',
          fontSize: responsiveFontSize,
          textTransform: 'none',

          '&:hover': {
            backgroundColor: 'primary.light',
          },
          transition: 'all 0.3s ease',
        },
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
    >
      {children}
    </Button>
  );
};

export default MainButton;
