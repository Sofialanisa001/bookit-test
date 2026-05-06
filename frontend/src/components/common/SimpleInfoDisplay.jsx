// MUI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box'

// Componente
import Text from '@/components/common/Text'

const SimpleInfoDisplay = 
({
    hasIcon='false',
    text='', title='', 
    icon, titleSize='14', textSize='14',
    titleColor= 'text.primary',
    textColor='primary.main',
    titleWeight = '400',
    textWeight='400',
    align='start', width='100%',
    flexDirection='row',
    background,
    border}) =>
{
    // <--------------- CONTEXTO --------------->
    const theme = useTheme();

    // <--------------- VALORES --------------->
    const finalBackground = background || theme.customGradients.searchBar; 
    const finalBorder = border || theme.palette.customBorders.infoDisplay;
    const iconDisplay = hasIcon ? icon : '';

    // <--------------- RENDER --------------->
    return(
        <Box sx=
        {{
            display: 'flex', flexDirection:flexDirection, alignItems: 'center', justifyContent: 'center', gap: 1,
            background: finalBackground, border: finalBorder,
            width: width, borderRadius: '10px', p:1
        }}>
           {iconDisplay} 
            <Text children={title} size={titleSize} fontWeight={titleWeight} color={titleColor} align={align} />
            <Text children={text} color={textColor} fontWeight={textWeight} size={textSize} align={align}/>
        </Box>
    )
}
export default SimpleInfoDisplay;