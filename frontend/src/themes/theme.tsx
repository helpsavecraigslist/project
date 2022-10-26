import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      light: '#F3F0F7',
      main: '#D8CDE2',
      dark: '#572F88',
      contrastText: '#fff',
    },
    secondary: {
      light: '#FFFFFF', // white for couple instances of white text on dark purple bg
      main: '#f44336', // unused 
      dark: '#ba000d', // unused
      contrastText: '#6D7278', // light grey for message text
    },
  },
});
