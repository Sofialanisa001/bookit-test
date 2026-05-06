import TextField from '@mui/material/TextField';

const TextInput = ({
  label = 'Lorem ipsum',
  type = 'text',
  placeholder = 'lorem ipsum',
  height = 'auto',
  background,
  border = 'secondary.main',
  borderHover = 'secondary.light',
  disabled,
  sx,
  ...props
}) => {
  return (
    <TextField
      label={label}
      type={type}
      placeholder={placeholder}
      variant='outlined'
      fullWidth
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      InputProps={{ notched: false }}
      FormHelperTextProps={{
        sx: {
          color: 'error.main',
          fontSize: { xs: '12px', md: '14px' },
        },
      }}
      {...props}
      sx={[
        {
          opacity: disabled ? 0.7 : 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
            height: height,
            color: 'white',
            fontFamily: "'Montserrat', sans-serif",
            backgroundColor: disabled
              ? 'background.default'
              : background || 'background.paper',

            '& fieldset': {
              borderColor: border,
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: 'secondary.blueShade',
            },
            '&.Mui-focused fieldset': {
              borderColor: disabled ? 'rgba(255, 255, 255, 0.3)' : border,
              borderWidth: '2px',
            },

            '& input::placeholder, & textarea::placeholder': {
              color: 'text.placeholder',
              opacity: 1,
            },

            '& input': {
              color: 'inherit',
              WebkitTextFillColor: 'inherit',
            },

            '&.MuiInputBase-multiline': {
              padding: '28px 24px 16px 24px',
              alignItems: 'flex-start',
            },
            '& .MuiInputBase-inputMultiline': {
              padding: 0,
            },
          },

          '& .MuiInputLabel-root': {
            color: disabled ? 'primary.dark' : 'primary.main',
            fontSize: '18px',
            fontWeight: '600',
            transform: 'translate(24px, 10px) scale(0.75) !important',
            transformOrigin: 'top left',
            '&.Mui-focused': {
              color: 'primary.main',
            },
          },

          '& .MuiInputBase-input': {
            fontSize: '16px',
            padding: '28px 24px 10px 24px',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};

export default TextInput;
