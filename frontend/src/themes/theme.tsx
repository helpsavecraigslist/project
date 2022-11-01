import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// This object controls the Material UI theme overrides.
// See here for how this object is structured:
// https://mui.com/material-ui/customization/default-theme/
// Color guide: https://mui.com/material-ui/customization/color/
let theme = createTheme({
  palette: {
    primary: {
      light: '#D8CDE2', // light purple color
      main: '#572F88', // menu bar color
      dark: '#572F88', // duplicate color, can change to whatever
      contrastText: '#FFFFFF', // white for couple instances of white text on dark purple bg
    },
    secondary: {
      light: '#efeef4',
      main: '#d5cde1', 
      dark: '#F3F0F7', // gray
      contrastText: '#6D7278', // light grey for message text
    },
  },
  typography: {
    fontFamily: 'Inika',
    h1: {
      fontSize: '5rem',
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    body1: {
      fontFamily: 'Roboto',
      fontSize: '1.25rem',
    },
    body2: {
      fontFamily: 'Roboto',
      fontSize: '1rem',
    },
    button: {
      fontSize: '1rem',
    },
  },
});
export const appTheme = responsiveFontSizes(theme);
