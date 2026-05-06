// MUI
import Typography from '@mui/material/Typography';

const Title = ({ children, color = "primary.main", align = "start", size = 32, textTransform= 'uppercase' }) => {
  // <--------------- VALORES --------------->
  const responsiveFontSize = typeof size === 'object' 
    ? { ...size }
    : {
        xs: `${Number(size) * 0.7}px`,
        sm: `${Number(size) * 0.85}px`,
        md: `${size}px`
      };

  // <--------------- RENDER --------------->
  return (
    <Typography
      variant="h1"
      textAlign={align}
      sx={{
        color: color,
        fontWeight: "bold",
        textTransform: textTransform,
        letterSpacing: "1px",
        fontSize: responsiveFontSize
      }}
      
    >
      {children}
    </Typography>
  );
};

export default Title;
