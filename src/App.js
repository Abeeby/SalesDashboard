import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VintedDashboard from './components/VintedDashboard';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<VintedDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 