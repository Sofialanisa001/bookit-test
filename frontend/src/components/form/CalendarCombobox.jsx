// React
import * as React from 'react';

// MUI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

// Iconos
import CloseIcon from '@mui/icons-material/Close';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CalendarCombobox = ({
  name,
  array,
  hasImage = false,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <FormControl sx={{ width: '100%', position: 'relative' }}>
      <Select
        value={value || ''}
        onChange={onChange}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return (
              <span style={{ opacity: 0.6, color: 'white' }}>
                {placeholder || name}
              </span>
            );
          }

          const selectedObj = hasImage
            ? array.find((item) => item.name === selected)
            : null;
          const photo = selectedObj ? selectedObj.foto : null;

          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              {hasImage && (
                <Avatar
                  src={photo}
                  sx={{ width: 24, height: 24, flexShrink: 0 }}
                />
              )}
              <Box
                component='span'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  color: 'white',
                }}
              >
                {selected}
              </Box>
            </Box>
          );
        }}
        MenuProps={{
          PaperProps: {
            style: { maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP },
            sx: {
              background: (theme) => theme.palette.background.serviceChip,
              color: 'text.primary',
              '& .MuiMenuItem-root:hover': {
                backgroundColor: 'background.hoverLight',
              },
              '& .MuiMenuItem-root.Mui-selected': {
                backgroundColor: (theme) => `${theme.palette.background.whiteSelected} !important`,
              },
              '& .MuiMenuItem-root.Mui-selected:hover': {
                backgroundColor: (theme) => `${theme.palette.background.whiteHover} !important`,
              },
            },
          },
        }}
        sx={{
          background: 'transparent',
          borderRadius: '8px',
          height: '40px',
          border: (theme) => `1px solid ${theme.palette.customBorders.inputDefault}`,
          '& .MuiSelect-select': {
            backgroundColor: 'transparent !important',
            paddingRight: '60px !important',
            boxSizing: 'border-box',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.9rem',
          },
          '.MuiSvgIcon-root': { fill: 'white !important' },
          '.MuiOutlinedInput-notchedOutline': { border: 'none' },
          '&:hover': { border: '1px solid rgba(255,255,255,0.3)' },
        }}
      >
        <MenuItem value='' disabled sx={{ display: 'none' }}>
          <span style={{ opacity: 0.6 }}>{placeholder || name}</span>
        </MenuItem>

        {array.map((element) => {
          const valor = hasImage ? element.name : element;
          const photo = hasImage ? element.foto : null;

          return (
            <MenuItem key={valor} value={valor}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                }}
              >
                {hasImage && (
                  <Avatar
                    src={photo}
                    sx={{ width: 24, height: 24, flexShrink: 0 }}
                  />
                )}
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.9rem',
                  }}
                >
                  {valor}
                </span>
              </Box>
            </MenuItem>
          );
        })}
      </Select>

      {value && (
        <IconButton
          size='small'
          onClick={() => onChange({ target: { value: '' } })}
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            right: '25px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.6)',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      )}
    </FormControl>
  );
};

export default CalendarCombobox;
