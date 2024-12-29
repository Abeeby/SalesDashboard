import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Erreur de rendu:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>Erreur de chargement</h1>
    <pre>${error.message}</pre>
  </div>`;
} 