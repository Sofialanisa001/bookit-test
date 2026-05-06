// *************************************************************************************************
// NOTA: Este solo es el cáscaron del colapsable, como cada colapsable tiene una estructura distinta
// entonces decidí manejar la estructura del header y body en archivos separados que están en la
// carpeta de collapsable.
// *************************************************************************************************

// MUI
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// Icono
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Collapsable = ({
  headerContent,
  children,
  background,
  backgroundSecondary,
}) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();

  // <--------------- RENDER --------------->
  return (
    <Accordion
      sx={{
        background: background || theme.customGradients.collapsableHeader,
        color: 'white',
        mb: 2,
        p: 0,
        width: '100%',
        minWidth: 0,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
        sx={{
          '& .MuiAccordionSummary-content': {
            minWidth: 0,
            width: '100%',
          },
        }}
      >
        {headerContent}
      </AccordionSummary>

      <AccordionDetails
        sx={{
          background:
            backgroundSecondary || theme.customGradients.collapsableDetails,
          p: 3,
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default Collapsable;
