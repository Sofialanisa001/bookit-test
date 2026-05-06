import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function getStyles(name, labelName, theme) {
  return {
    fontWeight:
      labelName === name
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  };
}

const Combobox = ({
  name,
  size = '16px',
  array,
  hasImage = false,
  placeholder,
  defaultValue = '',
  onValueChange,
  disabled = false,
  value,
}) => {
  const theme = useTheme();
  const [labelName, setLabelName] = useState(defaultValue);

  const handleChange = (event) => {
    setLabelName(event.target.value);
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  const currentValue = value !== undefined ? value : labelName;

  return (
    <FormControl sx={{ width: '100%' }}>
      <Select
        id='select'
        value={currentValue}
        onChange={handleChange}
        displayEmpty
        disabled={disabled}
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ opacity: 0.6 }}>{placeholder || name}</span>;
          }

          const selectedObj = hasImage
            ? array.find((item) => item.name === selected)
            : null;
          const photo = selectedObj ? selectedObj.pfp : null;

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
                  alt={selected}
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
                }}
              >
                {selected}
              </Box>
            </Box>
          );
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
              maxWidth: 300,
            },
            sx: {
              background: (theme) => theme.customGradients.comboboxMenu,
              color: 'text.primary',
              '& .MuiMenuItem-root': {
                fontSize: size,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                py: 1.5,
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: (theme) =>
                  `${theme.palette.background.menuHover} !important`,
              },
              '& .MuiMenuItem-root.Mui-selected': {
                backgroundColor: (theme) =>
                  `${theme.palette.background.menuSelected} !important`,
                color: 'text.primary',
              },
            },
          },
        }}
        sx={{
          background: (theme) => theme.customGradients.calendar,
          borderRadius: '8px',
          height: '56px',

          '& .MuiSelect-select': {
            backgroundColor: 'transparent !important',
            color: 'text.primary',
            fontSize: size,
            paddingRight: '40px !important',
            boxSizing: 'border-box',
          },
          '.MuiSvgIcon-root': {
            fill: (theme) => theme.palette.primary.main + ' !important',
          },
          '.MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },

          '&.Mui-disabled': {
            opacity: 0.5, 
            '& .MuiSelect-select': {
              color: 'text.primary',
              WebkitTextFillColor: 'white',
            },
          },
        }}
      >
        <MenuItem value='' disabled sx={{ display: 'none' }}>
          <span style={{ opacity: 0.6 }}>{placeholder || name}</span>
        </MenuItem>

        {array.map((element) => {
          const valor = hasImage ? element.name : element;
          const photo = hasImage ? element.pfp : null;

          return (
            <MenuItem
              key={valor}
              value={valor}
              style={getStyles(valor, labelName, theme)}
            >
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
                    alt={valor}
                    src={photo}
                    sx={{ width: 24, height: 24, flexShrink: 0 }}
                  />
                )}
                <span>{valor}</span>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default Combobox;
