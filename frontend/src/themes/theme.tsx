import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      light: '#F3F0F7', // gray
      main: '#D8CDE2', // light purple color
      dark: '#572F88', // menu bar color
      contrastText: '#572F88', // purple text for use with main
    },
    secondary: {
      light: '#FFFFFF', // white for couple instances of white text on dark purple bg
      main: '#f44336', // unused 
      dark: '#ba000d', // unused
      contrastText: '#6D7278', // light grey for message text
    },
  },
});
