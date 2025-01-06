import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { authenticateVinted, checkVintedAuth } from './services/vintedAuth';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const isValid = await checkVintedAuth();
      if (!isValid) {
        const authResult = await authenticateVinted();
        setIsAuthenticated(authResult.success);
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        {isAuthenticated ? (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </>
        ) : (
          <Navigate to="https://www.vinted.fr" replace />
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 