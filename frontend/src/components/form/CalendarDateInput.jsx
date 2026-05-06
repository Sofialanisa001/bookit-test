// React
import React from 'react';

// MUI
import TextField from '@mui/material/TextField';

const CalendarDateInput = ({ value, onChange }) => {
  return (
    <TextField
      type="date"
      value={value}
      onChange={onChange}
      size="small"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'white',
          height: '40px', 
          borderRadius: '8px',
          backgroundColor: 'transparent',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '0.9rem',
          '& fieldset': { 
            borderColor: 'customBorders.inputDefault',
            borderWidth: '1px'
          },
          '&:hover fieldset': { 
            borderColor: 'rgba(255,255,255,0.3) !important' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: 'white !important',
            borderWidth: '1px !important'
          },
        },
        'input[type="date"]::-webkit-calendar-picker-indicator': { 
          filter: 'invert(1)', 
          cursor: 'pointer',
          opacity: 0.8,
          '&:hover': { opacity: 1 }
        }
      }}
    />
  );
};

export default CalendarDateInput;