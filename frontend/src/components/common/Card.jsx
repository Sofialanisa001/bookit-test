// MUI
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const Card = ({ 
  children, 
  bg,
  brRadius = '12px', 
  showShadow = false, 
  shadowColor,
  offset = 8
}) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();

  // <--------------- VALORES --------------->
  const background = bg || theme.palette.background.paper;
  const shadow = shadowColor || theme.palette.customShadows.card;
  
  // <--------------- RENDER --------------->
  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%', 
        maxWidth: { xs: '95%', sm: '450px' }, 
        margin: 'auto' 
      }}
    >
      {showShadow && (
        <Box
          sx={{
            position: 'absolute',
            top: offset,
            left: -offset,
            width: '100%',
            height: '100%',
            backgroundColor: shadow,
            borderRadius: brRadius,
            zIndex: 1,
            opacity: 0.5,
          }}
        />
      )}

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 2,
          padding: { xs: 3, sm: 4 },
          width: '100%',
          background: background,
          borderRadius: brRadius,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: (theme) => theme.palette.customBorders.sidebar, 
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default Card;