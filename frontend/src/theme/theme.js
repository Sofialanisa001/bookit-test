import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffb550',
      light: '#ffb74d',
      dark: '#e0a040',
      contrastText: '#000000',
    },
    secondary: {
      main: '#787ff6',
      light: '#a6aafa',
      blueShade: '#a6aafa',
      brandBlue: '#3f51b5',
      calendarLabel: '#a0a3de',
      purpleAccent: '#6C63FF',
    },
    success: {
      main: '#4caf50',
    },
    neutral: {
      main: '#757575',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#060511',
      paper: '#0c0c18',
      formCard: '#111225',
      scheduleUnselected: '#171836',
      serviceChip: '#1b1c37',
      overlay: 'rgba(0,0,0,0.5)',
      authOverlay: 'rgba(0, 0, 0, 0.4)',
      inputInner: '#16162b',
      inputTransparent: 'rgba(255, 255, 255, 0.03)',
      genderActive: 'rgba(255, 157, 64, 0.15)',
      genderInactive: 'rgba(255, 255, 255, 0.05)',
      hoverLight: 'rgba(255, 255, 255, 0.1)',
      hoverLighter: 'rgba(255, 255, 255, 0.05)',
      transparent: 'transparent',
      menuSelected: 'rgba(255, 183, 77, 0.4)',
      menuHover: 'rgba(255, 183, 77, 0.2)',
      modalMenu: '#00011e',
      calendarGrid: '#121229',
      whiteSelected: 'rgba(255, 255, 255, 0.2)',
      whiteHover: 'rgba(255, 255, 255, 0.3)',
      activeMenuItem: 'rgba(255, 255, 255, 0.08)',
      statusActive: 'rgba(76, 175, 80, 0.1)',
      statusInactive: 'rgba(244, 67, 54, 0.1)',
    },
    action: {
      disabledBackground: '#a9a9a9',
      disabled: '#666',
    },
    divider: '#cbd4ff6e',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      placeholder: 'rgba(255, 255, 255, 0.4)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      muted: 'rgba(255, 255, 255, 0.6)',
      inactive: 'rgba(255, 255, 255, 0.2)',
    },
    customBorders: {
      calendar: '2px solid #2c2e5bba',
      form: '2px solid #2c2e5bba',
      infoDisplay: '1.5px solid #2c2e5bba',
      schedule: '1px solid #060511',
      avatar: '1px solid #ced0ffa6',
      section: '1px solid #787ff6',
      inputDefault: '#2a2b4a',
      genderSelect: '1.5px solid #6C63FF',
      sidebar: '1px solid rgba(255, 255, 255, 0.05)',
      primaryMain: '1px solid rgba(255, 181, 80, 0.5)',
      inputHover: '1px solid rgba(255, 255, 255, 0.3)',
      statusActive: '1px solid rgba(76, 175, 80, 0.5)',
      statusInactive: '1px solid rgba(244, 67, 54, 0.5)',
    },
    customShadows: {
      card: '#787ff6',
    },
  },
  customLayout: {
    drawerWidthExpanded: 260,
    drawerWidthCollapsed: 70,
  },
  customCharts: {
    barGradient: [
      '#00dced',
      '#4cc9ff',
      '#6baaff',
      '#8589ff',
      '#8794ff',
      '#a8b0ff',
    ],
    barMixed: ['#424571', '#232050', '#00dced', '#4cc9ff', '#6baaff'],
    gridLine: 'rgba(255,255,255,0.1)',
  },
  customGradients: {
    mainBackground: 'linear-gradient(180deg, #0c0c18 0%, #060511 100%)',
    dialog: 'linear-gradient(180deg, #2c2e69 0%, #2d2e5c 100%)',
    calendar: 'linear-gradient(180deg, #2c2e5b 0%, #13154d 100%)',
    collapsableHeader: 'linear-gradient(180deg, #2c2e5b 0%, #1c1e51d3 100%)',
    collapsableDetails: 'linear-gradient(180deg, #000114c2 0%, #0e0f30 100%)',
    scheduleSelected: 'linear-gradient(180deg, #6c74cc 0%, #4f58a3 100%)',
    header: 'linear-gradient(180deg, #4e5082 0%, #3b3d75d3 100%)',
    navbar: 'linear-gradient(180deg, #121229 100%, #1b1c37 0%)',
    imagePlaceholder:
      'linear-gradient(180deg, #8791eb 0%, #9291d8 50%, #69abca 100%)',
    serviceImage:
      'linear-gradient(180deg, #87CEEB 0%, #a8e6cf 50%, #90EE90 100%)',
    searchBar: 'linear-gradient(180deg, #2c2e5b 0%, #1c1e51d3 100%)',
    clientDataCard: 'linear-gradient(180deg, #11122b 0%, #1c1e51d3 100%)',
    inputField: 'linear-gradient(180deg, #1b1c37 0%, #11122b 100%)',
    menuMobile: 'linear-gradient(180deg, #1b1c37 100%, #272951 0%)',
    sidebar: 'linear-gradient(180deg, #1b1c37 0%, #121229 100%)',
    comboboxMenu: 'linear-gradient(180deg, #1b1c37 100%, #a0a3de 0%)',
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h1: { fontFamily: "'Syncopate', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Syncopate', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Syncopate', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Syncopate', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Syncopate', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Syncopate', sans-serif", fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
});

export default theme;
