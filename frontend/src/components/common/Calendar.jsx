// MUI
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

export default function Calendar({ value, onChange }) {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();
  
  // <--------------- RENDER --------------->
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={onChange}
        disablePast
        maxDate={dayjs('2099-12-31')}
        sx={{
          background: (theme) => theme.customGradients.calendar,
          borderRadius: '15px',
          border: (theme) => theme.palette.customBorders.calendar,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',

          '& .MuiPickersCalendarHeader-root': { color: 'text.primary' },
          '& .MuiIconButton-root': { color: 'text.primary' },
          '& .MuiDayCalendar-weekDayLabel': {
            color: 'secondary.calendarLabel',
            fontWeight: 'bold',
          },
          '& .MuiPickersDay-root': { color: 'text.primary', fontSize: '1rem' },
          '& .MuiPickersDay-root.Mui-selected': {
            backgroundColor: 'primary.light !important',
            color: 'background.default',
            fontWeight: 'bold',
          },
          '& .MuiPickersDay-root.Mui-selected:hover': {
            backgroundColor: 'primary.main !important',
          },
          '& .MuiPickersDay-today': {
            border: (theme) =>
              `1px solid ${theme.palette.primary.light} !important`,
          },
        }}
      />
    </LocalizationProvider>
  );
}