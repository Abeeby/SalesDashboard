import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VintedDashboard from './components/VintedDashboard.js';
import VintedAuth from './components/VintedAuth.js';
import useAuth from './hooks/useAuth.js';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<VintedAuth />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <VintedDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App; 