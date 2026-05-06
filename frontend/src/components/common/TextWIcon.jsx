// MUI
import Box from '@mui/material/Box'

// Componente
import Text from '@/components/common/Text';

const TextWIcon = ({icon, text}) =>
{
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, gap: 1.5 }}>
        {icon}
        <Text children={text} align='start' color='text.primary' size='14' />
      </Box>
    );
}

export default TextWIcon;