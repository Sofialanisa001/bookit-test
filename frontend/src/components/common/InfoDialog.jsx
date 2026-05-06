// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

// Icono
import CheckCircleIcon from '@mui/icons-material/CheckCircleRounded';

function InfoDialog({
  open,
  onClose,
  title,
  icon,
  content,
  onTransitionExited,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableRestoreFocus
      disableEnforceFocus
      TransitionProps={{
        onExited: onTransitionExited,
      }}
      aria-labelledby='info-dialog-title'
      sx={{
        '& .MuiDialog-paper': {
          width: '85%',
          maxWidth: '400px',
          background: (theme) => theme.customGradients.dialog,
          borderRadius: '20px',
          padding: 1,
        },
      }}
    >
      <DialogTitle
        id='info-dialog-title'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1, md: 1.5 },
          color: 'primary.main',
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {icon || (
          <CheckCircleIcon sx={{ fontSize: { xs: '5rem', md: '8rem' } }} />
        )}
        <Typography
          component='span'
          sx={{
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            fontWeight: '600',
            fontFamily: 'inherit',
            mt: '10px',
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          color: 'text.primary',
          textAlign: 'center',
          py: 3,
          fontSize: { xs: '1rem', md: '1.3rem' },
        }}
      >
        {content}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          variant='contained'
          onClick={onClose}
          sx={{
            borderRadius: '50px',
            px: 5,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InfoDialog;