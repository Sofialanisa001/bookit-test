// MUI
import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// Componentes
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';

const CardServices = ({image, name, description}) =>
{
  return (
    <Card elevation={0} 
      sx=
      {{  
        maxWidth: 275, display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center',
        background: 'none',
    }}>
      <CardMedia
        sx={{ width: 140, height: 140,  borderRadius: '100%'}}
        image={image}
        title={name}
      />
      <CardContent>
        <Box sx={{p:2}}>
          <Title children={name} align='center' color='text.primary' size='20'/>
        </Box>
        
        <Text children={description} align='center' color='primary.main' size='14'/>
      </CardContent>
    </Card>
  );
}

export default CardServices;
