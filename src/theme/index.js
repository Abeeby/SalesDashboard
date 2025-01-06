import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#2E7D32',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
        }
      }
    }
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#81C784',
      light: '#A5D6A7',
      dark: '#4CAF50',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    }
  }
}); 