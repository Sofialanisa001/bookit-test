// React
import React, { useState, useEffect } from 'react';

// Schema
import { empleadoSchema } from '@/schemas/empleado.schema';

// Utils
import { toastError } from '@/utils/notify';

// MUI
import Box from '@mui/material/Box';

// Componentes propios
import MainButton from '@/components/common/MainButton';
import EmployeeDataSection from '@/components/employees/sections/EmployeeDataSection';
import ScheduleSection from '@/components/common/ScheduleSection';
import ServicesSection from '@/components/employees/sections/ServicesSection';

const EmployeeForm = ({
  employee,
  empresaHorario,
  listaServicios,
  onCancel,
  onSave,
}) => {
  // <--------------- ESTADOS --------------->
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    info: '',
    foto: null,
    archivoFisico: null,
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

  const [selectedServices, setSelectedServices] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    if (employee && employee.id !== 'nuevo') {
      const serviciosNombres = employee.servicios
        ? employee.servicios
            .map((id) => {
              const s = listaServicios.find((serv) => serv._id === id);
              return s ? s.nombre : null;
            })
            .filter((n) => n)
        : [];

      const newScheduleMap = {
        Domingo: [],
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
      };

      if (employee.horario) {
        const timeToMins = (timeStr) => {
          const [h, m] = timeStr.split(':').map(Number);
          return h * 60 + m;
        };

        const minsToTime = (mins) => {
          const h = Math.floor(mins / 60)
            .toString()
            .padStart(2, '0');
          const m = (mins % 60).toString().padStart(2, '0');
          return `${h}:${m}`;
        };

        const diasBackendToMap = {
          domingo: 'Domingo',
          lunes: 'Lunes',
          martes: 'Martes',
          miercoles: 'Miércoles',
          jueves: 'Jueves',
          viernes: 'Viernes',
          sabado: 'Sábado',
        };

        employee.horario.forEach((turno) => {
          const diaExacto = diasBackendToMap[turno.dia];

          if (diaExacto && newScheduleMap[diaExacto]) {
            const startMins = timeToMins(turno.horaInicio);
            const endMins = timeToMins(turno.horaFin);

            const bloques = [];
            for (let m = startMins; m < endMins; m += 30) {
              bloques.push(`${minsToTime(m)}-${minsToTime(m + 30)}`);
            }

            newScheduleMap[diaExacto] = bloques;
          }
        });
      }

      setFormData({
        name: employee.nombre || '', 
        email: employee.correo || '', 
        phone: employee.telefono || '', 
        birthdate: employee.fechaNacimiento
          ? employee.fechaNacimiento.split('T')[0]
          : '', 
        info: employee.informacion || '', 
        foto: employee.foto?.url || null,
        archivoFisico: null,
      });

      setScheduleMap(newScheduleMap);
      setSelectedServices(serviciosNombres);
    } else {
      // RESET para empleado nuevo
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        info: '',
        foto: null,
        archivoFisico: null,
      });
      setScheduleMap({
        Domingo: [],
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
      });
      setSelectedServices([]);
    }
  }, [employee, listaServicios]);

  // <--------------- FUNCIONES --------------->

  // Funcion input text
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (
      formErrors[
        name === 'name'
          ? 'nombre'
          : name === 'phone'
            ? 'telefono'
            : name === 'email'
              ? 'correo'
              : name === 'info'
                ? 'informacion'
                : name
      ]
    ) {
      setFormErrors((prev) => ({
        ...prev,
        [name === 'name'
          ? 'nombre'
          : name === 'phone'
            ? 'telefono'
            : name === 'email'
              ? 'correo'
              : name === 'info'
                ? 'informacion'
                : name]: null,
      }));
    }
  };

  // Funcion fecha
  const handleDateChange = (event) => {
    setFormData((prev) => ({ ...prev, birthdate: event.target.value }));
    if (formErrors.fechaNacimiento)
      setFormErrors((prev) => ({ ...prev, fechaNacimiento: null }));
  };

  // Funcion foto
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, foto: photoUrl, archivoFisico: file }));
      if (formErrors.foto) setFormErrors((prev) => ({ ...prev, foto: null }));
    }
  };

  // Agregar / Quitar servicios
  const handleServiceToggle = (serviceName) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceName)) {
        return prev.filter((name) => name !== serviceName);
      } else {
        return [...prev, serviceName];
      }
    });
    // Se quita el error si se agrego un servicio nuevo
    if (formErrors.servicios && !selectedServices.includes(serviceName)) {
      setFormErrors((prev) => ({ ...prev, servicios: null }));
    }
  };

  // Funcion agregar/editar empleado
  const handleSubmit = async () => {
    if (isSaving) return;

    // Se limpian los errores
    setFormErrors({});

    // Se preparan los datos para validar con zod
    const dataToValidate = {
      nombre: formData.name,
      correo: formData.email,
      telefono: formData.phone,
      fechaNacimiento: formData.birthdate,
      informacion: formData.info,
      foto: formData.archivoFisico || formData.foto,
      servicios: selectedServices,
    };

    // Validamos los datos
    const validation = empleadoSchema.safeParse(dataToValidate);

    let currentErrors = {};

    if (!validation.success) {
      currentErrors = validation.error.flatten().fieldErrors;
    }

    // Validar horario
    let errorHorario = null;
    const tieneHorario = Object.values(scheduleMap).some(
      (bloques) => bloques && bloques.length > 0,
    );

    if (!tieneHorario) {
      errorHorario = 'Debe asignar al menos un horario laboral en la semana.';
    } else if (empresaHorario && empresaHorario.length > 0) {
      const diasReverseMap = {
        Domingo: 'domingo',
        Lunes: 'lunes',
        Martes: 'martes',
        Miércoles: 'miercoles',
        Jueves: 'jueves',
        Viernes: 'viernes',
        Sábado: 'sabado',
      };

      const timeToMins = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      for (const [dia, bloques] of Object.entries(scheduleMap)) {
        if (!bloques || bloques.length === 0) continue;

        const diaBaseDatos = diasReverseMap[dia];
        const empresaAbreEseDia = empresaHorario.find(
          (h) => h.dia === diaBaseDatos,
        );

        if (!empresaAbreEseDia) {
          errorHorario = `La empresa no labora el día ${dia}.`;
          break;
        }

        const empresaInicio = timeToMins(empresaAbreEseDia.horaInicio);
        const empresaFin = timeToMins(empresaAbreEseDia.horaFin);

        for (const bloque of bloques) {
          const [inicioBloque, finBloque] = bloque.split('-');
          if (
            timeToMins(inicioBloque) < empresaInicio ||
            timeToMins(finBloque) > empresaFin
          ) {
            errorHorario = `El horario del ${dia} excede el horario de la empresa (${empresaAbreEseDia.horaInicio} - ${empresaAbreEseDia.horaFin}).`;
            break;
          }
        }
        if (errorHorario) break;
      }
    }

    if (errorHorario) {
      currentErrors.horario = [errorHorario];
    }

    // Si hay algún error se hace scroll al primer error
    if (Object.keys(currentErrors).length > 0) {
      setFormErrors(currentErrors);

      setTimeout(() => {
        const fieldOrder = [
          'foto',
          'nombre',
          'correo',
          'fechaNacimiento',
          'telefono',
          'informacion',
          'horario',
          'servicios',
        ];

        for (const key of fieldOrder) {
          if (currentErrors[key]) {
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

    setIsSaving(true);

    // Si no hay errores, se ejecuta el guardado
    try {
      await onSave({
        ...employee,
        ...formData,
        scheduleMap,
        services: selectedServices,
      });
    } catch (error) {
      toastError(
        typeof error === 'string'
          ? error
          : 'Error al intentar crear el empleado.',
        'create-employee-error',
      );
    } finally {
      setIsSaving(false);
    }
  };

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        color: 'white',
      }}
    >
      {/* Datos del empleado */}
      <Box>
        <EmployeeDataSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handlePhotoChange={handlePhotoChange}
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
          onAction={() => {
            if (formErrors.horario) {
              setFormErrors((prev) => ({ ...prev, horario: null }));
            }
          }}
        />
      </Box>

      {/* Servicios */}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '16px',
          border: (theme) => theme.palette.customBorders.section,
        }}
      >
        <ServicesSection
          availableServices={
            listaServicios ? listaServicios.map((s) => s.nombre) : []
          }
          selectedServices={selectedServices}
          onServiceToggle={handleServiceToggle}
          error={formErrors.servicios ? formErrors.servicios[0] : null}
        />
      </Box>

      {/* Boton guardar */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <MainButton
          size={{ xs: '16px', md: '18px' }}
          onClick={handleSubmit}
          disabled={isSaving}
          sx={{
            px: 6,
            backgroundColor: isSaving
              ? 'action.disabledBackground'
              : 'primary.light',
            color: isSaving ? 'action.disabled' : 'primary.contrastText',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {isSaving
            ? 'Guardando'
            : employee?.id === 'nuevo'
              ? 'Agregar'
              : 'Guardar'}
        </MainButton>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
