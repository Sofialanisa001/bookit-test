import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

const NavOptions = ({
  icon,
  text,
  textSize = '0.6rem',
  textDirection = 'column',
  link,
  isActive,
}) => {
  return (
    <Button
      component={RouterLink}
      to={link}
      sx={{
        display: 'flex',
        flexDirection: textDirection,
        fontSize: textSize,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'normal',
        color: isActive ? 'secondary.blueShade' : 'secondary.main',
        transition: '0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'background.transparent',
          color: 'secondary.blueShade',
        },
      }}
    >
      {icon}
      {text}
    </Button>
  );
};

export default NavOptions;
