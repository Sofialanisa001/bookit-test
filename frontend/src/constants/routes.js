export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENTE',
};

// Base admin 
const ADMIN_BASE = '/admin';

// Rutas de la aplicacion
export const ROUTES = {
  NOT_FOUND: '/404',

  PUBLIC: {
    ROOT: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
  },

  CLIENT: {
    MAIN: '/main',
    BOOK: '/book-appointment',
    APPOINTMENTS: '/my-appointments',
    PROFILE: '/profile',
  },

  ADMIN: {
    BASE: ADMIN_BASE,
    CALENDAR: `${ADMIN_BASE}/appointment-calendar`,
    BOOK: `${ADMIN_BASE}/book-appointment`,
    EMPLOYEES: `${ADMIN_BASE}/employees`,
    SERVICES: `${ADMIN_BASE}/services`,
    COMPANY: `${ADMIN_BASE}/company-info`,
    SUSPENSIONS: `${ADMIN_BASE}/suspensions`,
    REPORTS: `${ADMIN_BASE}/reports`,
  },
};
