import toast from 'react-hot-toast';
import theme from '@/theme/theme';

const baseStyle = {
  borderRadius: '10px',
  background: theme.palette.background.serviceChip, // Color de fondo
  color: theme.palette.text.primary, // Color del texto
  duration: 3000,
};

// Notificacion de exito
export const toastSuccess = (message, toastId) => {
  toast.success(message, {
    id: toastId,
    style: {
      ...baseStyle,
      border: `1px solid ${theme.palette.success.main}`,
    },
    iconTheme: {
      primary: theme.palette.success.main,
      secondary: theme.palette.text.primary,
    },
  });
};

// Notificacion de cancelar
export const toastNeutral = (message, toastId) => {
  toast.success(message, {
    id: toastId,
    style: {
      ...baseStyle,
      border: `1px solid ${theme.palette.neutral.main}`,
    },
    iconTheme: {
      primary: theme.palette.neutral.main,
      secondary: theme.palette.text.primary,
    },
  });
};

// Notificacion de error
export const toastError = (message, toastId) => {
  toast.error(message, {
    id: toastId,
    style: {
      ...baseStyle,
      border: `1px solid ${theme.palette.error.main}`,
    },
    iconTheme: {
      primary: theme.palette.error.main,
      secondary: theme.palette.text.primary,
    },
  });
};