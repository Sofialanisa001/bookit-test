// React
import React, { useState, useEffect } from 'react';

// MUI
import Box from '@mui/material/Box';

// Utils
import { toastSuccess, toastError } from '@/utils/notify';

// API y Esquemas
import { getEmpresa, updateEmpresa } from '@/api/empresa.api';
import { empresaSchema } from '@/schemas/empresa.schema';

// Componentes propios
import Title from '@/components/common/Title';
import MainButton from '@/components/common/MainButton';
import CompanyDataSection from '@/components/company/CompanyDataSection';
import ScheduleSection from '@/components/common/ScheduleSection';
import CompanyGallerySection from '@/components/company/CompanyGallerySection';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';

const CompanyInfo = () => {
  // <--------------- ESTADOS --------------->

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    descripcion: '',
    slogan: '',
    direccion: '',
    logo: null,
    archivoFisicoLogo: null,
  });

  const [scheduleMap, setScheduleMap] = useState({
    Domingo: [],
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
    Sábado: [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [originalGalleryData, setOriginalGalleryData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [empresaId, setEmpresaId] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(false);

  // <--------------- DERIVADOS --------------->
  // GET datos de la empresa
  const fetchDatos = async () => {
      try {
        setIsLoadingData(true);
        setServerError(false);
        
        const response = await getEmpresa();
        const data = response.empresa;

        if (data) {
          // Id empresa
          setEmpresaId(data._id || data.id);

          // Datos empresa
          setFormData({
            nombre: data.nombre || '',
            correo: data.correo || '',
            telefono: data.telefono || '',
            descripcion: data.descripcion || '',
            slogan: data.slogan || '',
            direccion: data.direccion || '',
            logo: data.logo?.url || null,
            archivoFisicoLogo: null,
          });

          // Imagen principal
          setMainImage(data.imagenPrincipal?.url || null);

          // Galeria
          if (data.galeria) {
            setOriginalGalleryData(data.galeria);
            const urlsGaleria = data.galeria.map((img) => img.url);
            setGalleryImages(urlsGaleria);
          }

          // Horario
          if (data.horarioGlobal) {
            const newSchedule = {
              Domingo: [],
              Lunes: [],
              Martes: [],
              Miércoles: [],
              Jueves: [],
              Viernes: [],
              Sábado: [],
            };

            const diasMap = {
              domingo: 'Domingo',
              lunes: 'Lunes',
              martes: 'Martes',
              miercoles: 'Miércoles',
              jueves: 'Jueves',
              viernes: 'Viernes',
              sabado: 'Sábado',
            };

            // Funcion que convierte las horas por 2 bloques de media hora
            const generarBloquesString = (inicio, fin) => {
              const timeToMins = (time) => {
                const [h, m] = time.split(':').map(Number);
                return h * 60 + m;
              };
              const minsToTime = (mins) => {
                const h = Math.floor(mins / 60)
                  .toString()
                  .padStart(2, '0');
                const m = (mins % 60).toString().padStart(2, '0');
                return `${h}:${m}`;
              };

              const bloques = [];
              const startMins = timeToMins(inicio);
              const endMins = timeToMins(fin);

              for (let m = startMins; m < endMins; m += 30) {
                bloques.push(`${minsToTime(m)}-${minsToTime(m + 30)}`);
              }
              return bloques;
            };

            // Se llena el calendario
            data.horarioGlobal.forEach((slot) => {
              const diaKey = diasMap[slot.dia.toLowerCase()];
              if (diaKey) {
                const bloquesDelDia = generarBloquesString(
                  slot.horaInicio,
                  slot.horaFin,
                );
                newSchedule[diaKey] = [
                  ...newSchedule[diaKey],
                  ...bloquesDelDia,
                ];
              }
            });

            setScheduleMap(newSchedule);
          }
        }
      } catch (error) {
        setServerError(true);
      } finally {
        setIsLoadingData(false);
      }
    };

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    fetchDatos();
  }, []);

  // <--------------- FUNCIONES --------------->

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
        archivoFisicoLogo: file,
      }));
      if (formErrors.logo) setFormErrors((prev) => ({ ...prev, logo: null }));
    }
  };

  const clearScheduleError = () => {
    if (formErrors.horario) {
      setFormErrors((prev) => ({ ...prev, horario: null }));
    }
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainImage(URL.createObjectURL(file));
      setMainImageFile(file);
      if (formErrors.imagenPrincipal)
        setFormErrors((prev) => ({ ...prev, imagenPrincipal: null }));
    }
  };

  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setGalleryImages((prev) => [...prev, ...newUrls]);
      setGalleryFiles((prev) => [...prev, ...files]);
      if (formErrors.galeria)
        setFormErrors((prev) => ({ ...prev, galeria: null }));
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setGalleryImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
    setGalleryFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSave = async () => {
    // Si ya se esta guardando, se ignoran los clicks extras
    if (isSaving) return;

    // Limpia los errores
    setFormErrors({});

    const dataToValidate = {
      ...formData,
      logo: formData.archivoFisicoLogo || formData.logo,
      imagenPrincipal: mainImageFile || mainImage,
      galeria: {
        urls: galleryImages,
        files: galleryFiles,
      },
      horario: scheduleMap,
    };

    // Se validan los campos
    const validation = empresaSchema.safeParse(dataToValidate);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors(fieldErrors);

      // Scroll al primer error
      setTimeout(() => {
        const fieldOrder = [
          'logo',
          'nombre',
          'correo',
          'telefono',
          'descripcion',
          'slogan',
          'direccion',
          'horario',
          'imagenPrincipal',
          'galeria',
        ];

        for (const key of fieldOrder) {
          if (fieldErrors[key]) {
            const element =
              document.getElementById(`field-${key}`) ||
              document.querySelector(`[name="${key}"]`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              break;
            }
          }
        }
      }, 50);

      return;
    }

    // Se activa el bloqueo de boton
    setIsSaving(true);

    try {
      // Se preparan los datos para enviar
      const payload = new FormData();

      payload.append('nombre', formData.nombre);
      payload.append('correo', formData.correo);
      payload.append('telefono', formData.telefono);
      payload.append('descripcion', formData.descripcion);
      payload.append('slogan', formData.slogan);
      payload.append('direccion', formData.direccion);

      const horarioArray = [];
      const diasReverseMap = {
        Domingo: 'domingo',
        Lunes: 'lunes',
        Martes: 'martes',
        Miércoles: 'miercoles',
        Jueves: 'jueves',
        Viernes: 'viernes',
        Sábado: 'sabado',
      };

      for (const [dia, slots] of Object.entries(scheduleMap)) {
        if (!slots || slots.length === 0) continue;

        const sortedSlots = [...slots].sort();

        let currentStart = sortedSlots[0].split('-')[0];
        let currentEnd = sortedSlots[0].split('-')[1];

        for (let i = 1; i < sortedSlots.length; i++) {
          const [nextStart, nextEnd] = sortedSlots[i].split('-');
          if (currentEnd === nextStart) {
            currentEnd = nextEnd;
          } else {
            horarioArray.push({
              dia: diasReverseMap[dia],
              horaInicio: currentStart,
              horaFin: currentEnd,
            });
            currentStart = nextStart;
            currentEnd = nextEnd;
          }
        }
        horarioArray.push({
          dia: diasReverseMap[dia],
          horaInicio: currentStart,
          horaFin: currentEnd,
        });
      }

      payload.append('horarioGlobal', JSON.stringify(horarioArray));

      if (formData.archivoFisicoLogo) {
        payload.append('logo', formData.archivoFisicoLogo);
      }

      if (mainImageFile) {
        payload.append('imagenPrincipal', mainImageFile);
      }

      galleryFiles.forEach((file) => {
        payload.append('nuevasFotosGaleria', file);
      });

      const fotosAntiguas = galleryImages
        .filter((url) => typeof url === 'string' && url.startsWith('http'))
        .map((urlConservada) => {
          const fotoOriginal = originalGalleryData.find(
            (img) => img.url === urlConservada,
          );

          return {
            _id: fotoOriginal._id,
            url: fotoOriginal.url,
            public_id: fotoOriginal.public_id,
          };
        });

      payload.append('galeriaConservada', JSON.stringify(fotosAntiguas));

      // Se hace la peticion
      await updateEmpresa(payload);

      toastSuccess(
        'Información actualizada correctamente.',
        'company-save-toast',
      );
    } catch (error) {
      toastError(
        typeof error === 'string' ? error : 'Error al guardar los datos',
        'company-error',
      );
    } finally {
      setIsSaving(false);
    }
  };

  // <--------------- RENDER --------------->

  if (isLoadingData) return <Loader height='100%' />;

  if (serverError) {
    return (
      <ErrorScreen
        onRetry={fetchDatos}
        offsetMobile='64px'
        offsetDesktop='80px'
      />
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '1000px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <Box>
        <Title
          children='INFORMACIÓN DE LA EMPRESA'
          size={{ xs: '2rem', md: '2.8rem' }}
          color='white'
          align='left'
        />
      </Box>

      {/* Datos */}
      <Box>
        <CompanyDataSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleLogoChange={handleLogoChange}
          formErrors={formErrors}
        />
      </Box>

      {/* Horario */}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '16px',
          border: (theme) => theme.palette.customBorders.section,
        }}
      >
        <ScheduleSection
          scheduleMap={scheduleMap}
          setScheduleMap={setScheduleMap}
          error={formErrors.horario ? formErrors.horario[0] : null}
          onAction={clearScheduleError}
        />
      </Box>

      {/* Galeria */}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '16px',
          border: (theme) => theme.palette.customBorders.section,
        }}
      >
        <CompanyGallerySection
          mainImage={mainImage}
          onMainImageChange={handleMainImageChange}
          galleryImages={galleryImages}
          onGalleryImagesChange={handleGalleryImagesChange}
          onRemoveGalleryImage={handleRemoveGalleryImage}
          errors={formErrors}
        />
      </Box>

      {/* Boton guardar */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <MainButton
          size={{ xs: '16px', md: '18px' }}
          onClick={handleSave}
          disabled={isSaving}
          sx={{
            backgroundColor: isSaving
              ? 'action.disabledBackground'
              : 'primary.light',
            color: isSaving ? 'action.disabled' : 'primary.contrastText',
            px: 8,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Guardar
        </MainButton>
      </Box>
    </Box>
  );
};

export default CompanyInfo;
