// MUI
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

// Componentes
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import SimpleInfoDisplay from '@/components/common/SimpleInfoDisplay';

const AppointmentHeader = ({ title, date, price }) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();

  // <--------------- LÓGICA --------------->
  const cleanPrice = parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;

  const formattedPrice = cleanPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // <--------------- RENDER --------------->
  return (
    <Grid
      container
      sx={{
        width: '100%',
        px: 1,
        py: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 2,
      }}
    >
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Title
          children={title}
          size={{ xs: '0.8rem', md: '1.3rem' }}
          color={'text.primary'}
        />
        <Text
          children={date}
          size={{ xs: '0.5rem', md: '0.9rem' }}
          color={'primary.main'}
          sx={{ wordBreak: 'break-word' }}
        />
      </Grid>
      <Grid sx={{ flexShrink: 0 }}>
        <SimpleInfoDisplay
          title='Costo:'
          text={`$${formattedPrice} MXN`}
          align='center'
          width='fit-content'
          textWeight='700'
          titleSize={{ xs: '0.7rem', md: '1rem' }}
          textColor='secondary.blueShade'
          background={theme.customGradients.header}
        />
      </Grid>
    </Grid>
  );
};

export default AppointmentHeader;