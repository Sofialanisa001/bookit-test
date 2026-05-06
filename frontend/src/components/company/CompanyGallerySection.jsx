// React
import React from 'react';

// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Iconos
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

// Componentes propios
import Text from '@/components/common/Text';
import MainButton from '@/components/common/MainButton';

const CompanyGallerySection = ({
  mainImage,
  onMainImageChange,
  galleryImages,
  onGalleryImagesChange,
  onRemoveGalleryImage,
  errors = {},
}) => {
  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {/* Titulo */}
      <Text children='Galería' color='primary.light' size='20' />

      {/* Imagen principal */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            id='field-imagenPrincipal'
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {/* Texto */}
            <Text
              children='Imagen principal'
              color='white'
              size='14px'
              align='center'
            />

            {/* Vista foto */}
            <Box
              sx={{
                width: '100%',
                aspectRatio: '1 / 1',
                background: mainImage
                  ? 'transparent'
                  : (theme) => theme.customGradients.imagePlaceholder,
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                border: mainImage ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt='Principal'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <InsertPhotoIcon
                  sx={{ fontSize: 80, color: 'white', opacity: 0.8 }}
                />
              )}
            </Box>

            {/* Boton subir foto principal */}
            <MainButton
              component='label'
              fullWidth
              size={{ xs: '14px', md: '16px' }}
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                borderRadius: '50px',
              }}
            >
              <UploadFileIcon fontSize='small' /> Subir principal
              <input
                type='file'
                accept='.png, .jpeg, .jpg, .webp'
                onChange={onMainImageChange}
                style={{ display: 'none' }}
              />
            </MainButton>

            {/* Error */}
            {errors.imagenPrincipal && (
              <Text
                children={errors.imagenPrincipal[0]}
                color='error.main'
                size='14px'
                align='center'
              />
            )}
          </Box>
        </Grid>

        {/* Galeria */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            id='field-galeria'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
              alignItems: 'stretch',
            }}
          >
            {/* Seccion arriba */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                gap: 2,
              }}
            >
              {/* Texto */}
              <Text
                children='Imágenes de la galería'
                color='white'
                size='14px'
              />

              {/* Boton agregar fotos */}
              <MainButton
                component='label'
                size={{ xs: '12px', md: '14px' }}
                sx={{
                  backgroundColor: 'transparent',
                  border: (theme) => `1px solid ${theme.palette.primary.light}`,
                  color: 'primary.light',
                  padding: '6px 16px',
                  m: 0,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                + Añadir más
                <input
                  type='file'
                  accept='.png, .jpeg, .jpg, .webp'
                  multiple
                  onChange={onGalleryImagesChange}
                  style={{ display: 'none' }}
                />
              </MainButton>
            </Box>

            {/* Contenedor fotos */}
            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: 'background.serviceChip',
                borderRadius: '16px',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                overflowX: 'auto',
                minHeight: '200px',
                justifyContent:
                  galleryImages.length === 0 ? 'center' : 'flex-start',
                '&::-webkit-scrollbar': { height: '8px' },
                '&::-webkit-scrollbar-track': {
                  background: (theme) => theme.palette.background.hoverLighter,
                  borderRadius: '10px',
                  margin: '0 10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: (theme) => theme.palette.primary.light,
                  borderRadius: '10px',
                },
              }}
            >
              {galleryImages.length === 0 ? (
                <Text
                  children='Aún no hay imágenes en la galería.'
                  color='rgba(255,255,255,0.4)'
                />
              ) : (
                galleryImages.map((imgUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      minWidth: '180px',
                      height: '180px',
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Galeria-${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Boton eliminar foto */}
                    <IconButton
                      onClick={() => onRemoveGalleryImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'background.overlay',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                        },
                      }}
                    >
                      <CloseIcon fontSize='small' sx={{ fontWeight: 'bold' }} />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>

            {/* Error */}
            {errors.galeria && (
              <Text
                children={errors.galeria[0]}
                color='error.main'
                size='14px'
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyGallerySection;
