import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { authenticateVinted, checkVintedAuth } from './services/vintedAuth';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const isValid = await checkVintedAuth();
      if (!isValid) {
        const authResult = await authenticateVinted();
        setIsAuthenticated(authResult.success);
        if (!authResult.success) {
          window.location.href = 'https://www.vinted.fr';
        }
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider>
      {isAuthenticated ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </>
      ) : null}
    </ThemeProvider>
  );
}

export default App; 